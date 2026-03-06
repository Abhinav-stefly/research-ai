import { ENV } from "../config/env.js";

const HF_BASE = "https://router.huggingface.co/api/models/";
const DEFAULT_MODEL = process.env.HF_EMBEDDING_MODEL || "sentence-transformers/all-MiniLM-L6-v2";

// Generate embedding via HF Inference API for a given text
export async function generateEmbedding(text, model = DEFAULT_MODEL) {
  if (!text || typeof text !== 'string') return [];

  // Truncate to avoid token limit issues
  const truncated = text.slice(0, 8000);

  const res = await fetch(HF_BASE + model, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ENV.HF_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ inputs: truncated, options: { wait_for_model: true } })
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`HF embedding error ${res.status}: ${txt}`);
  }

  const data = await res.json();

  // HF returns embeddings as an array of arrays or a direct array
  if (Array.isArray(data)) {
    if (Array.isArray(data[0])) {
      // If multiple embeddings, average them or return first
      if (data.length === 1) return data[0];
      // Average vectors
      const dim = data[0].length;
      const avg = new Array(dim).fill(0);
      data.forEach(vec => {
        vec.forEach((val, i) => { avg[i] += val; });
      });
      avg.forEach((_, i) => { avg[i] /= data.length; });
      return avg;
    } else if (typeof data[0] === 'number') {
      return data;
    }
  }

  if (data?.error) throw new Error(data.error);
  return [];
}

// Generate embeddings for multiple texts (batches for efficiency)
export async function generateEmbeddings(texts, model = DEFAULT_MODEL) {
  if (!texts || !Array.isArray(texts) || texts.length === 0) return [];

  const embeddings = [];
  // Process in batches of 5 to avoid rate limits
  for (let i = 0; i < texts.length; i += 5) {
    const batch = texts.slice(i, i + 5);
    for (const text of batch) {
      try {
        const emb = await generateEmbedding(text, model);
        embeddings.push(emb);
      } catch (err) {
        console.error(`Embedding generation failed for text chunk:`, err.message);
        // Push zero vector as fallback
        embeddings.push([]);
      }
    }
  }
  return embeddings;
}
