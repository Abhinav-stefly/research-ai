export function cleanText(text) {
  return text
    .replace(/\n{2,}/g, "\n")
    .replace(/\s+/g, " ")
    .trim();
}
