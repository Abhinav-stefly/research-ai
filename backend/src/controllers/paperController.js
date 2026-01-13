import Paper from "../models/Paper.js";
import { parsePDF } from "../ai/pdfParser.js";
import { cleanText } from "../utils/textCleaner.js";
import { segmentSections } from "../ai/sectionSegmenter.js";
import { extractCitations } from "../utils/citationExtractor.js";

export const uploadPaper = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "PDF file required" });
    }

    const rawText = await parsePDF(req.file.path);
    const cleanedText = cleanText(rawText);
    const sections = segmentSections(cleanedText);
    const citations = extractCitations(cleanedText);

    const paper = await Paper.create({
      user: req.user._id,
      title: req.file.originalname,
      filePath: req.file.path,
      rawText,
      cleanedText,
      sections,
      citations
    });

    res.status(201).json({
      message: "Paper uploaded & parsed successfully",
      paper
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "PDF processing failed" });
  }
};
