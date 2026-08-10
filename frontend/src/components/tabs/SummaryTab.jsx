import { useState, useEffect } from 'react';
import CitationGraph from '../CitationGraph';

export default function SummaryTab({ paperId, token, summaries, onHighlight }) {
  const [mode, setMode] = useState('short');

  useEffect(() => {
    // If parent provided summaries, use them. Mode switch would trigger refetch in parent in a full app.
  }, [mode, paperId]);

  const hasSummaries = summaries && Object.values(summaries).some((value) => value && value.trim());

  return (
    <div className="space-y-4">
      <div className="card flex items-center justify-between">
        <div>
          <h3 className="font-bold">Summaries</h3>
          <p className="text-sm text-[var(--text-muted)]">Mode: {mode}</p>
        </div>
        <select value={mode} onChange={(e) => setMode(e.target.value)} className="input max-w-xs">
          <option value="short">Short Summary</option>
          <option value="detailed">Detailed Summary</option>
        </select>
      </div>

      {!hasSummaries && (
        <div className="card text-center text-[var(--text-muted)]">
          No summaries were returned for this paper, but the citation graph is available below.
        </div>
      )}

      {hasSummaries && Object.entries(summaries).map(([key, value]) => (
        value && (
          <div key={key} className="card group relative overflow-hidden">
            {/* gradient band */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)]" />

            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg capitalize mb-2">{key}</h3>
              <div className="flex items-center space-x-2">
                <button onClick={() => onHighlight && onHighlight(key)} className="btn-secondary text-sm">
                  Highlight
                </button>
                <button
                  onClick={() => navigator.clipboard?.writeText(value)}
                  className="text-[var(--text-muted)] text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  📋 Copy
                </button>
              </div>
            </div>
            <p className="text-[var(--text-primary)] whitespace-pre-wrap">{value}</p>
          </div>
        )
      ))}

      {/* Citation Graph */}
      <CitationGraph paperId={paperId} token={token} />
    </div>
  );
}
