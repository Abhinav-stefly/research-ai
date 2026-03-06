import { ENV } from "../config/env.js";

// FIX: was using process.env.HF_MODEL inconsistently while importing ENV for the key
const DEFAULT_MODEL = ENV.HF_MODEL || "facebook/bart-large-cnn";
const HF_BASE = "https://router.huggingface.co/";

function chunkText(text, maxChars = 3000) {
  if (!text) return [];
  const paragraphs = text.split(/\n\n+/);
  const chunks = [];
  let current = "";

  for (const p of paragraphs) {
    if ((current + "\n\n" + p).length <= maxChars) {
      current = current ? current + "\n\n" + p : p;
    } else {
      if (current) chunks.push(current);
      if (p.length > maxChars) {
        const sentences = p.match(/[^\.?!]+[\.?!]+\s*/g) || [p];
        let curSent = "";
        for (const s of sentences) {
          if ((curSent + s).length <= maxChars) {
            curSent += s;
          } else {
            if (curSent) chunks.push(curSent);
            curSent = s;
          }
        }
        if (curSent) chunks.push(curSent);
        current = "";
      } else {
        current = p;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

async function hfSummarize(text, mode = "short", model = DEFAULT_MODEL) {
  if (!text || !text.trim()) return "";

  // For now, provide a simple fallback summarization
  // TODO: Replace with working API when available
  console.log(`[Summarizer] Fallback: Processing text of length ${text.length}`);

  const words = text.split(/\s+/).filter(w => w.length > 0);
  const summaryLength = mode === "detailed" ? Math.min(50, words.length) : Math.min(20, words.length);

  if (words.length <= summaryLength) {
    return text;
  }

  // Simple extractive summarization: take first few sentences
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const numSentences = Math.min(mode === "detailed" ? 3 : 2, sentences.length);

  return sentences.slice(0, numSentences).join('. ').trim() + '.';
}

export async function summarizeSections(sections = {}, mode = "short") {
  const output = {};
  const keys = [
    "abstract",
    "introduction",
    "methodology",
    "results",
    "conclusion",
  ];

  for (const key of keys) {
    const text = (sections && sections[key]) || "";
    if (!text || !text.trim()) {
      output[key] = "";
      continue;
    }

    const chunks = chunkText(text, 3000);
    const summaries = [];

    for (const chunk of chunks) {
      try {
        const summary = await hfSummarize(chunk, mode);
        if (summary) summaries.push(summary);
      } catch (err) {
        console.error(`Summarization failed for ${key}:`, err.message);
      }
    }

    // FIX: was joining with '\n' (single newline) causing run-on blocks on frontend
    output[key] = summaries.join("\n\n");
  }

  return output;
}