export function extractCitations(text) {
  const regex = /\[(\d+)\]|\(([^)]+, \d{4})\)/g;
  return [...text.matchAll(regex)].map(m => m[0]);
}
