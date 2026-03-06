// Compute cosine similarity between two vectors
export function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;
  if (vecA.length !== vecB.length) return 0;

  let dotProduct = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    magA += vecA[i] * vecA[i];
    magB += vecB[i] * vecB[i];
  }

  magA = Math.sqrt(magA);
  magB = Math.sqrt(magB);

  if (magA === 0 || magB === 0) return 0;
  return dotProduct / (magA * magB);
}

// Find top N similar papers from a list of papers
export function findSimilarPapers(referenceEmbedding, papers, topN = 5) {
  if (!referenceEmbedding || referenceEmbedding.length === 0) return [];
  if (!papers || papers.length === 0) return [];

  // Compute similarity scores
  const scored = papers
    .map(paper => ({
      paperId: paper._id,
      title: paper.title,
      createdAt: paper.createdAt,
      similarity: cosineSimilarity(referenceEmbedding, paper.embeddings || [])
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topN);

  return scored;
}
