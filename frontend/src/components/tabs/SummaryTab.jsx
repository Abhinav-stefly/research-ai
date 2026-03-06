import { useState, useEffect } from 'react';
import CitationGraph from '../CitationGraph';

export default function SummaryTab({ paperId, token, summaries, onHighlight }) {
  const [mode, setMode] = useState('short');

  useEffect(() => {
    // If parent provided summaries, use them. Mode switch would trigger refetch in parent in a full app.
  }, [mode, paperId]);

  if (!summaries) return <div className="card text-center">No summary available</div>;

  return (
    <div className="space-y-4">
      <div className="card flex items-center justify-between">
        <div>
          <h3 className="font-bold">Summaries</h3>
          <p className="text-sm text-gray-500">Mode: {mode}</p>
        </div>
        <select value={mode} onChange={(e) => setMode(e.target.value)} className="input max-w-xs">
          <option value="short">Short Summary</option>
          <option value="detailed">Detailed Summary</option>
        </select>
      </div>

      {Object.entries(summaries).map(([key, value]) => (
        value && (
          <div key={key} className="card">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg capitalize mb-2">{key}</h3>
              <button onClick={() => onHighlight && onHighlight(key)} className="btn-secondary text-sm">Highlight</button>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{value}</p>
          </div>
        )
      ))}

      {/* Citation Graph */}
      <CitationGraph paperId={paperId} token={token} />
    </div>
  );
}
