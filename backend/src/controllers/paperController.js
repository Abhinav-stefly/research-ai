import Paper from "../models/Paper.js";
import { parsePDF } from "../ai/pdfParser.js";
import { cleanText } from "../utils/textCleaner.js";
import { segmentSections } from "../ai/sectionSegmenter.js";
import { extractCitations } from "../utils/citationExtractor.js";
import { summarizeSections } from "../ai/summarizer.js";
import fs from "fs";
import Citation from "../models/Citation.js";
import mongoose from "mongoose";

export const getPapers = async (req, res, next) => {
  try {
    const papers = await Paper.find({ user: req.user._id }).sort({ createdAt: -1 });
    
    res.json({
      papers: papers.map(paper => ({
        _id: paper._id,
        title: paper.title,
        createdAt: paper.createdAt,
        sectionCount: Object.keys(paper.sections || {}).length,
        citationCount: paper.citations?.length || 0
      }))
    });
  } catch (error) {
    console.error('Get papers error:', error.message);
    next(new Error('Failed to get papers'));
  }
};

export const uploadPaper = async (req, res, next) => {
  let uploadedFilePath = null;

  try {
    // Validate file upload
    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required" });
    }

    uploadedFilePath = req.file.path;

    // Parse PDF to extract text
    let rawText;
    try {
      rawText = await parsePDF(uploadedFilePath);
    } catch (parseError) {
      if (fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }
      console.error("PDF parsing error:", parseError.message);
      return res.status(400).json({
        message: "Failed to parse PDF file",
        error: parseError.message,
      });
    }

    // Validate extracted text
    if (!rawText || rawText.trim().length === 0) {
      if (fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }
      return res
        .status(400)
        .json({ message: "PDF appears to be empty or unreadable" });
    }

    // Clean extracted text
    const cleanedText = cleanText(rawText);

    // Segment sections
    let sections = {};
    try {
      sections = segmentSections(cleanedText);
      console.log('Section segmentation result:', Object.keys(sections).filter(k => sections[k]));
    } catch (segmentError) {
      console.error("Section segmentation warning:", segmentError.message);
      // Continue even if segmentation fails
    }

    // Summarize sections — FIX: was never called before
    const mode = req.query.mode || "short";
    let summaries = {};
    try {
      summaries = await summarizeSections(sections, mode);
    } catch (summaryError) {
      console.error("Summarization warning:", summaryError.message);
      // Continue even if summarization fails
    }

    // Extract citations
    let citations = [];
    try {
      citations = extractCitations(cleanedText);
    } catch (citationError) {
      console.error("Citation extraction warning:", citationError.message);
      // Continue even if citation extraction fails
    }

    // Remove temporary upload after processing; Render filesystem is ephemeral.
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      try {
        fs.unlinkSync(uploadedFilePath);
      } catch (cleanupError) {
        console.warn("Could not delete temporary upload file:", cleanupError.message);
      }
    }

    // Save paper to database — FIX: summaries now persisted
    const paper = await Paper.create({
      user: req.user._id,
      title: req.file.originalname,
      filePath: null,
      rawText,
      cleanedText,
      sections,
      summaries,
      citations,
    });

    res.status(201).json({
      message: "Paper uploaded and parsed successfully",
      paper: {
        _id: paper._id,
        title: paper.title,
        createdAt: paper.createdAt,
        textLength: rawText.length,
        sectionCount: Object.keys(sections).length,
        citationCount: citations.length,
        summaries: paper.summaries,
      },
    });
  } catch (error) {
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      fs.unlinkSync(uploadedFilePath);
    }
    console.error("Upload error:", error.message);
    next(new Error(`PDF upload and processing failed: ${error.message}`));
  }
};

export const reprocessPaper = async (req, res, next) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid paper ID' });
    }
    
    const paper = await Paper.findById(req.params.id);
    if (!paper) return res.status(404).json({ message: 'Paper not found' });

    // Authorization check
    if (paper.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Re-segment sections with improved logic
    const sections = segmentSections(paper.cleanedText || paper.rawText || '');

    // Re-generate summaries
    const summaries = await summarizeSections(sections, 'short');

    // Update paper
    paper.sections = sections;
    paper.summaries = summaries;
    await paper.save();

    res.json({
      message: 'Paper reprocessed successfully',
      paper: {
        _id: paper._id,
        title: paper.title,
        sections,
        summaries,
        createdAt: paper.createdAt
      }
    });
  } catch (error) {
    console.error('Reprocess error:', error.message);
    next(new Error('Failed to reprocess paper'));
  }
};

export const getPaper = async (req, res, next) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid paper ID' });
    }
    
    const paper = await Paper.findById(req.params.id);
    if (!paper) return res.status(404).json({ message: 'Paper not found' });

    // Authorization check
    if (paper.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({
      paper: {
        _id: paper._id,
        title: paper.title,
        sections: paper.sections || {},
        summaries: paper.summaries || {},
        createdAt: paper.createdAt
      }
    });
  } catch (error) {
    console.error('Get paper error:', error.message);
    next(new Error('Failed to get paper'));
  }
};

export const getSummary = async (req, res, next) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) return res.status(404).json({ message: "Paper not found" });

    // Authorization check
    if (paper.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Return cached summaries if they already exist
    if (
      paper.summaries &&
      Object.values(paper.summaries).some((v) => v && v.trim())
    ) {
      return res.json({ summaries: paper.summaries });
    }

    // Generate on demand if not yet stored
    const mode = req.query.mode || "short";
    const summaries = await summarizeSections(paper.sections || {}, mode);

    if (!summaries || !Object.values(summaries).some((v) => v && v.trim())) {
      return res.status(502).json({
        message:
          "AI model returned empty summaries. Check HF_API_KEY or model availability.",
      });
    }

    await Paper.findByIdAndUpdate(req.params.id, { summaries });

    res.json({ summaries });
  } catch (error) {
    console.error("Summary error:", error.message);
    next(new Error(`Summarization failed: ${error.message}`));
  }
};

export const getCitations = async (req, res, next) => {
  try {
    const paperId = req.params.id;
    const paper = await Paper.findById(paperId);
    if (!paper) return res.status(404).json({ message: "Paper not found" });

    const text = paper.cleanedText || paper.rawText || "";
    const extracted = extractCitations(text);

    // Remove existing citation records for this paper to avoid duplicates
    await Citation.deleteMany({ paper: paper._id });

    const citationsToInsert = [];

    // Insert reference list entries
    (extracted.references || []).forEach((ref) => {
      citationsToInsert.push({
        paper: paper._id,
        referenceIndex: ref.index,
        referenceText: ref.raw,
        inlineRaw: null,
        context: null,
      });
    });

    // Parse inline numeric citations and map to reference indices when possible
    const inlineNumeric =
      (extracted.inline && extracted.inline.numeric) || [];
    const parseIds = (idsStr) => {
      const parts = idsStr.split(",").map((s) => s.trim());
      const out = [];
      parts.forEach((p) => {
        if (p.includes("-") || p.includes("–")) {
          const [a, b] = p
            .replace("–", "-")
            .split("-")
            .map((n) => parseInt(n, 10));
          if (!isNaN(a) && !isNaN(b)) for (let i = a; i <= b; i++) out.push(i);
        } else {
          const n = parseInt(p, 10);
          if (!isNaN(n)) out.push(n);
        }
      });
      return Array.from(new Set(out));
    };

    inlineNumeric.forEach((inl) => {
      const ids = parseIds(inl.ids || "");
      if (ids.length === 0) {
        citationsToInsert.push({
          paper: paper._id,
          referenceIndex: null,
          referenceText: null,
          inlineRaw: inl.raw,
          context: null,
        });
      } else {
        ids.forEach((idx) =>
          citationsToInsert.push({
            paper: paper._id,
            referenceIndex: idx,
            referenceText: null,
            inlineRaw: inl.raw,
            context: null,
          })
        );
      }
    });

    // Author-year inline citations
    const authorYear =
      (extracted.inline && extracted.inline.authorYear) || [];
    authorYear.forEach((a) =>
      citationsToInsert.push({
        paper: paper._id,
        referenceIndex: null,
        referenceText: a.text,
        inlineRaw: a.raw,
        context: null,
      })
    );

    if (citationsToInsert.length > 0)
      await Citation.insertMany(citationsToInsert);

    // Build citation graph: nodes and edges
    const nodes = [];
    const edges = [];

    nodes.push({ id: `paper:${paper._id}`, label: paper.title || "paper" });
    (extracted.references || []).forEach((ref) =>
      nodes.push({ id: `ref:${ref.index}`, label: ref.raw.slice(0, 120) })
    );

    citationsToInsert.forEach((c) => {
      if (c.referenceIndex)
        edges.push({
          from: `paper:${paper._id}`,
          to: `ref:${c.referenceIndex}`,
          metadata: { inlineRaw: c.inlineRaw },
        });
      else
        edges.push({
          from: `paper:${paper._id}`,
          to: `ref:unlinked`,
          metadata: { inlineRaw: c.inlineRaw, referenceText: c.referenceText },
        });
    });

    const graph = { nodes, edges };

    res.json({ extracted, graph });
  } catch (error) {
    console.error("Get citations error:", error.message);
    next(new Error("Failed to extract citations"));
  }
};