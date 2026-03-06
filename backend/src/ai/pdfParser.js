import fs from "fs";
import path from "path";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export async function parsePDF(filePath) {
  try {
    // Validate file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`PDF file not found at path: ${filePath}`);
    }

    // Read file data
    const data = new Uint8Array(fs.readFileSync(filePath));

    if (data.length === 0) {
      throw new Error("PDF file is empty");
    }

    // Parse PDF document
    const pdf = await pdfjsLib.getDocument({ data }).promise;

    if (pdf.numPages === 0) {
      throw new Error("PDF has no pages");
    }

    let fullText = "";

    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        const pageText = content.items
          .map(item => item.str)
          .join(" ");

        fullText += pageText + "\n\n";
      } catch (pageError) {
        console.warn(`Warning: Failed to parse page ${i}:`, pageError.message);
        // Continue with next page instead of failing completely
      }
    }

    return fullText.trim();
  } catch (error) {
    throw new Error(`PDF parsing failed: ${error.message}`);
  }
}

