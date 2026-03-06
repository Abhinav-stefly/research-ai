import { ENV } from "../config/env.js";
import { verbalizeMathSymbols } from "../utils/textCleaner.js";

const HF_BASE = "https://router.huggingface.co/api/models/";
const DEFAULT_MODEL = process.env.HF_MATH_MODEL || "google/flan-t5-large";

// Detect inline/math blocks: $...$, \(...\), \[...\], or \begin{equation}...\end{equation}
const MATH_REGEX = /\$(.+?)\$|\\\((.+?)\\\)|\\\[(.+?)\\\]|\\begin\{(?:equation|align|math)\}([\s\S]*?)\\end\{(?:equation|align|math)\}/g;

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
    const txt = await res.text();
    throw new Error(`HF error ${res.status}: ${txt}`);
  }

  const data = await res.json();
  if (Array.isArray(data)) {
    if (data[0]?.generated_text) return data.map(d => d.generated_text).join('\n');
    if (data[0]?.summary_text) return data.map(d => d.summary_text).join('\n');
    if (typeof data[0] === 'string') return data.join('\n');
  }
  if (data?.error) throw new Error(data.error);
  if (typeof data === 'string') return data;
  return '';
}

// Explain a single math expression using hybrid rule-based then LLM
async function explainExpression(latex, level = 'eli5') {
  // Rule-based verbalization first
  const verbal = verbalizeMathSymbols(latex);

  // Build deterministic prompt
  const prompt = level === 'graduate'
    ? `Translate the following LaTeX/math expression into a clear, rigorous explanation suitable for a graduate student. Include intuition, key steps, and any assumptions. Provide short examples if helpful. Expression:\n${latex}\n\nVerbalized tokens:\n${verbal}`
    : `Translate the following LaTeX/math expression into a clear, simple explanation suitable for a student who is learning the concept. Use plain language, simple analogies, and expand symbols into words. Expression:\n${latex}\n\nVerbalized tokens:\n${verbal}`;

  try {
    const out = await callHF(prompt);
    return out.trim();
  } catch (err) {
    // Fallback to the verbalization if HF fails
    return verbal || latex;
  }
}

// Main export: scan text, explain each math expression, and return map and combined text
export async function explainMathInText(text, level = 'eli5') {
  if (!text || typeof text !== 'string') return { explanations: [], combined: '' };

  const matches = [];
  let m;
  while ((m = MATH_REGEX.exec(text)) !== null) {
    const expr = m[1] || m[2] || m[3] || m[4] || '';
    const start = m.index;
    const end = MATH_REGEX.lastIndex;
    matches.push({ expr: expr.trim(), start, end });
  }

  const explanations = [];
  for (const item of matches) {
    const explanation = await explainExpression(item.expr, level);
    explanations.push({ expression: item.expr, explanation });
  }

  // Build combined explanation text
  const combined = explanations.map(e => `Expression: ${e.expression}\nExplanation: ${e.explanation}`).join('\n\n');

  return { explanations, combined };
}
