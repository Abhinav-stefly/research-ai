export function cleanText(text) {
  return text
    .replace(/\n{2,}/g, "\n")
    .replace(/\s+/g, " ")
    .trim();
}

// Convert common math symbols and LaTeX commands into natural-language tokens.
export function verbalizeMathSymbols(text) {
  if (!text || typeof text !== 'string') return '';

  const map = {
    '\\sum': 'summation',
    '\\prod': 'product',
    '\\int': 'integral',
    '\\partial': 'partial derivative',
    '\\nabla': 'nabla operator',
    '\\infty': 'infinity',
    '\\alpha': 'alpha',
    '\\beta': 'beta',
    '\\gamma': 'gamma',
    '\\delta': 'delta',
    '\\epsilon': 'epsilon',
    '\\theta': 'theta',
    '\\lambda': 'lambda',
    '\\rightarrow': 'implies',
    '\\to': 'to',
    '\\leftarrow': 'implies (left)',
    '\\pm': 'plus or minus',
    '\\cdot': 'times',
    '\\times': 'times',
    '\\leq': 'less than or equal to',
    '\\geq': 'greater than or equal to',
    '\\approx': 'approximately equal to',
    '\\equiv': 'equivalent to',
    '\\sqrt': 'square root',
    '∑': 'summation',
    '∂': 'partial derivative',
    '∫': 'integral',
    'α': 'alpha',
    'β': 'beta',
    'γ': 'gamma',
    '≤': 'less than or equal to',
    '≥': 'greater than or equal to',
    '≈': 'approximately equal to'
  };

  let out = text;
  // Replace LaTeX commands first
  for (const [k, v] of Object.entries(map)) {
    const esc = k.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
    out = out.replace(new RegExp(esc, 'g'), ` ${v} `);
  }

  // Collapse whitespace introduced
  return out.replace(/\s+/g, ' ').trim();
}
