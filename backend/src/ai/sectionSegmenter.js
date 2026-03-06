// Heuristic-based section segmentation for research papers.
// Detects: Abstract, Introduction, Methodology, Results, Conclusion.
// Returns a JSON object with keys: abstract, introduction, methodology, results, conclusion

export function segmentSections(text) {
  const empty = {
    abstract: '',
    introduction: '',
    methodology: '',
    results: '',
    conclusion: ''
  };

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return empty;
  }

  const result = { ...empty };

  // Normalize
  const normalized = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/[ ]{3,}/g, '  ');

  // ── STRATEGY 1: Line-by-line heading detection ──────────────────────────
  const standalonePatterns = {
    abstract:     /^(?:[\divxIVX]+[\.\s\)]*\s*)?abstract\s*$/i,
    introduction: /^(?:[\divxIVX]+[\.\s\)]*\s*)?(?:introduction|background|overview|related\s*work)\s*$/i,
    methodology:  /^(?:[\divxIVX]+[\.\s\)]*\s*)?(?:methodology|methods?|approach|materials?(?:\s*and\s*methods?)?|data|implementation|proposed\s*method|experimental\s*setup|system\s*design)\s*$/i,
    results:      /^(?:[\divxIVX]+[\.\s\)]*\s*)?(?:results?|experiments?|evaluation|findings|analysis|performance|experimental\s*results?)\s*$/i,
    conclusion:   /^(?:[\divxIVX]+[\.\s\)]*\s*)?(?:conclusions?|discussion|summary|future\s*work|concluding\s*remarks?)\s*$/i,
  };

  const inlinePatterns = {
    abstract:     /^(?:[\divxIVX]+[\.\s\)]*\s*)?abstract\s*[:\-–—\.]/i,
    introduction: /^(?:[\divxIVX]+[\.\s\)]*\s*)?(?:introduction|background|overview|related\s*work)\s*[:\-–—\.]/i,
    methodology:  /^(?:[\divxIVX]+[\.\s\)]*\s*)?(?:methodology|methods?|approach|materials?(?:\s*and\s*methods?)?|data|implementation|proposed\s*method|experimental\s*setup)\s*[:\-–—\.]/i,
    results:      /^(?:[\divxIVX]+[\.\s\)]*\s*)?(?:results?|experiments?|evaluation|findings|analysis|performance|experimental\s*results?)\s*[:\-–—\.]/i,
    conclusion:   /^(?:[\divxIVX]+[\.\s\)]*\s*)?(?:conclusions?|discussion|summary|future\s*work|concluding\s*remarks?)\s*[:\-–—\.]/i,
  };

  const lines = normalized.split('\n');
  let currentSection = null;
  let buffer = [];

  const flushBuffer = () => {
    if (currentSection && buffer.length > 0) {
      const chunk = buffer.join('\n').trim();
      if (chunk) {
        result[currentSection] += (result[currentSection] ? '\n\n' : '') + chunk;
      }
    }
    buffer = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    let matched = null;
    for (const [name, pattern] of Object.entries(standalonePatterns)) {
      if (pattern.test(line)) { matched = name; break; }
    }
    if (matched) {
      flushBuffer();
      currentSection = matched;
      continue;
    }

    let inlineMatched = null;
    for (const [name, pattern] of Object.entries(inlinePatterns)) {
      if (pattern.test(line)) { inlineMatched = name; break; }
    }
    if (inlineMatched) {
      flushBuffer();
      currentSection = inlineMatched;
      const rest = line.replace(/^[^:\-–—\.]+[:\-–—\.]\s*/i, '').trim();
      if (rest) buffer.push(rest);
      continue;
    }

    if (currentSection) {
      buffer.push(rawLine);
    } else if (line.length > 0) {
      buffer.push(rawLine);
    }
  }
  flushBuffer();

  // ── STRATEGY 2: Paragraph-based fallback ───────────────────────────────
  const s1Filled = Object.values(result).filter(v => v.trim().length > 50).length;
  if (s1Filled < 2) {
    for (const key of Object.keys(result)) result[key] = '';

    const paragraphs = normalized
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 10);

    const paraPatterns = {
      abstract:     /^(?:[\divxIVX]+[\.\s\)]*\s*)?abstract\b/i,
      introduction: /^(?:[\divxIVX]+[\.\s\)]*\s*)?(?:introduction|background|overview|related\s*work)\b/i,
      methodology:  /^(?:[\divxIVX]+[\.\s\)]*\s*)?(?:methodology|methods?|approach|materials?(?:\s*and\s*methods?)?|data|implementation|proposed\s*method|experimental\s*setup)\b/i,
      results:      /^(?:[\divxIVX]+[\.\s\)]*\s*)?(?:results?|experiments?|evaluation|findings|analysis|performance|experimental\s*results?)\b/i,
      conclusion:   /^(?:[\divxIVX]+[\.\s\)]*\s*)?(?:conclusions?|discussion|summary|future\s*work|concluding\s*remarks?)\b/i,
    };

    let paraSection = null;
    for (const para of paragraphs) {
      let found = null;
      for (const [name, pattern] of Object.entries(paraPatterns)) {
        if (pattern.test(para)) { found = name; break; }
      }
      if (found) {
        paraSection = found;
        result[paraSection] += (result[paraSection] ? '\n\n' : '') + para;
      } else if (paraSection) {
        result[paraSection] += (result[paraSection] ? '\n\n' : '') + para;
      } else {
        result.abstract += (result.abstract ? '\n\n' : '') + para;
      }
    }
  }

  // ── STRATEGY 3: Equal-division fallback ────────────────────────────────
  const s2Filled = Object.values(result).filter(v => v.trim().length > 50).length;
  if (s2Filled < 2) {
    for (const key of Object.keys(result)) result[key] = '';
    const words = normalized.split(/\s+/).filter(w => w.length > 0);
    if (words.length > 100) {
      const s = Math.floor(words.length / 5);
      result.abstract     = words.slice(0,     s    ).join(' ');
      result.introduction = words.slice(s,     s * 2).join(' ');
      result.methodology  = words.slice(s * 2, s * 3).join(' ');
      result.results      = words.slice(s * 3, s * 4).join(' ');
      result.conclusion   = words.slice(s * 4        ).join(' ');
    } else {
      result.abstract = normalized.trim();
    }
  }

  // Final cleanup
  for (const key of Object.keys(result)) {
    result[key] = result[key]
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  return result;
}