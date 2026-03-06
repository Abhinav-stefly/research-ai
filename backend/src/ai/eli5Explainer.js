import { ENV } from "../config/env.js";

const HF_BASE = "https://router.huggingface.co/api/models/";
const DEFAULT_MODEL = process.env.HF_EXPLAIN_MODEL || "google/flan-t5-large";

function chunkTextForExplain(text, maxChars = 3000) {
  if (!text) return [];
  const paragraphs = text.split(/\n\n+/);
  const chunks = [];
  let current = '';

  for (const p of paragraphs) {
    if ((current + '\n\n' + p).length <= maxChars) {
      current = current ? current + '\n\n' + p : p;
    } else {
      if (current) chunks.push(current);
      if (p.length > maxChars) {
        const sentences = p.match(/[^\.?!]+[\.?!]+\s*/g) || [p];
        let curSent = '';
        for (const s of sentences) {
          if ((curSent + s).length <= maxChars) curSent += s;
          else {
            if (curSent) chunks.push(curSent);
            curSent = s;
          }
        }
        if (curSent) chunks.push(curSent);
        current = '';
      } else {
        current = p;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

async function callHF(prompt, model = DEFAULT_MODEL) {
  const res = await fetch(HF_BASE + model, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ENV.HF_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ inputs: prompt, options: { wait_for_model: true } })
  });

  if (!res.ok) {
    throw new Error(`HF error ${res.status}`);
  }

  const result = await res.json();
  if (Array.isArray(result)) {
    if (result[0]?.generated_text) return result[0].generated_text;
    if (typeof result[0] === 'string') return result[0];
  }
  if (typeof result === 'string') return result;
  return '';
}

export async function explainText(text, level = 'eli5') {
  if (!text || !text.trim()) return '';

  const chunks = chunkTextForExplain(text, 3000);
  const outputs = [];

  for (const chunk of chunks) {
    const prompt = level === 'graduate'
      ? `Explain the following text in depth for a graduate student. Provide intuition and key concepts:\n\n${chunk}`
      : `Explain the following text as if to a 5-year-old. Use simple words:\n\n${chunk}`;

    try {
      const explanation = await callHF(prompt);
      if (explanation) outputs.push(explanation);
    } catch (err) {
      console.error('Explain call failed:', err.message);
    }
  }

  return outputs.join('\n\n');
}
