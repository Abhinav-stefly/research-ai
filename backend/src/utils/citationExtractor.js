export function extractCitations(text) {
  if (!text || typeof text !== 'string') return { inline: [], references: [] };

  // Find inline numeric citations like [1], [2,3], [1-3]
  const inlineNums = [];
  const bracketRe = /\[(\d+(?:[\-–]\d+)?(?:\s*,\s*\d+(?:[\-–]\d+)?)*)\]/g;
  let m;
  while ((m = bracketRe.exec(text)) !== null) {
    inlineNums.push({ raw: m[0], ids: m[1] });
  }

  // Find author-year citations like (Smith et al., 2020)
  const authorYear = [];
  const authRe = /\(([^)]+?,\s*\d{4}[a-z]?)\)/g;
  while ((m = authRe.exec(text)) !== null) {
    authorYear.push({ raw: m[0], text: m[1] });
  }

  // Extract reference list by locating 'References' or 'Bibliography'
  const refs = [];
  const lower = text.toLowerCase();
  const refIdx = lower.indexOf('\nreferences') !== -1 ? lower.indexOf('\nreferences') : lower.indexOf('\nbibliography');
  if (refIdx !== -1) {
    const refText = text.slice(refIdx + 1);
    // Split by numbered entries or by double newlines
    const numberedSplit = refText.split(/\n\s*\[?\d+\]?\s*/).map(s => s.trim()).filter(Boolean);
    if (numberedSplit.length > 1) {
      // first element may be the header
      for (let i = 1; i < numberedSplit.length; i++) {
        refs.push({ index: i, raw: numberedSplit[i] });
      }
    } else {
      const paraSplit = refText.split(/\n\n+/).map(s => s.trim()).filter(Boolean);
      // drop the header if present
      if (paraSplit.length > 0 && /^(references|bibliography)/i.test(paraSplit[0])) paraSplit.shift();
      paraSplit.forEach((r, i) => refs.push({ index: i + 1, raw: r }));
    }
  }

  return { inline: { numeric: inlineNums, authorYear }, references: refs };
}
