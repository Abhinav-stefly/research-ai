import Paper from "../models/Paper.js";
import { summarizeSections } from "../ai/summarizer.js";
import { explainText } from "../ai/eli5Explainer.js";
import { explainMathInText } from "../ai/mathExplainer.js";
import { generateEmbedding } from "../ai/embeddings.js";
import { findSimilarPapers } from "../ai/similarity.js";

export const summarizePaper = async (req, res, next) => {
  try {
    const paperId = req.params.id;
    const mode = req.query.mode === 'detailed' ? 'detailed' : 'short';

    const paper = await Paper.findById(paperId);
    if (!paper) return res.status(404).json({ message: 'Paper not found' });

    const sections = paper.sections || {};
    const summaries = await summarizeSections(sections, mode);

    paper.summaries = summaries;
    await paper.save();

    res.json({ message: 'Summaries generated', summaries });
  } catch (error) {
    console.error('Summarization error:', error.message);
    next(new Error('Summarization failed'));
  }
};

export const explain = async (req, res, next) => {
  try {
    const { text, level } = req.body;
    const lvl = level === 'graduate' ? 'graduate' : 'eli5';

    if (!text || typeof text !== 'string') return res.status(400).json({ message: 'Text is required in request body' });

    const explanation = await explainText(text, lvl);

    res.json({ explanation });
  } catch (error) {
    console.error('Explain error:', error.message);
    next(new Error('Explain failed'));
  }
};

export const explainMath = async (req, res, next) => {
  try {
    const { text, level } = req.body;
    const lvl = level === 'graduate' ? 'graduate' : 'eli5';

    if (!text || typeof text !== 'string') return res.status(400).json({ message: 'Text is required in request body' });

    const result = await explainMathInText(text, lvl);

    res.json(result);
  } catch (error) {
    console.error('Math explain error:', error.message);
    next(new Error('Math explanation failed'));
  }
};

export const getSimilarPapers = async (req, res, next) => {
  try {
    const paperId = req.params.id;
    const topN = parseInt(req.query.topN) || 5;

    const paper = await Paper.findById(paperId);
    if (!paper) return res.status(404).json({ message: 'Paper not found' });

    // Generate embedding if not exists
    if (!paper.embeddings || paper.embeddings.length === 0) {
      const text = paper.cleanedText || paper.rawText || paper.title || '';
      if (!text) return res.status(400).json({ message: 'Paper has no text to embed' });
      
      const emb = await generateEmbedding(text);
      paper.embeddings = emb;
      await paper.save();
    }

    // Find all other papers and compute similarity
    const allPapers = await Paper.find({ _id: { $ne: paperId } }).lean();

    // Generate embeddings for papers that don't have them
    const papersToEmbed = allPapers.filter(p => !p.embeddings || p.embeddings.length === 0);
    for (const p of papersToEmbed) {
      try {
        const text = p.cleanedText || p.rawText || p.title || '';
        if (text) {
          const emb = await generateEmbedding(text);
          p.embeddings = emb;
          await Paper.updateOne({ _id: p._id }, { embeddings: emb });
        }
      } catch (err) {
        console.warn(`Could not embed paper ${p._id}:`, err.message);
      }
    }

    // Refresh all papers with latest embeddings
    const allPapersWithEmbed = await Paper.find({ _id: { $ne: paperId } }).lean();

    const similar = findSimilarPapers(paper.embeddings, allPapersWithEmbed, topN);

    res.json({ paper: { _id: paper._id, title: paper.title }, similar });
  } catch (error) {
    console.error('Similarity error:', error.message);
    next(new Error('Similarity search failed'));
  }
};
