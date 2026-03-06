import { useState } from 'react';
import { aiAPI } from '../../api';

export default function MathTab({ paperId, level, token }) {
  const [text, setText] = useState('');
  const [explanations, setExplanations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleExplainMath = async () => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await aiAPI.explainMath(text, level, token);
      setExplanations(res.data.explanations || []);
    } catch (err) {
      console.error('Math explain failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="card">
        <label className="block text-sm font-medium mb-2">Mathematical Text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="input min-h-32"
          placeholder="Paste mathematical expressions or equations (LaTeX format)..."
        />
        <button
          onClick={handleExplainMath}
          className="btn-primary mt-4"
          disabled={loading || !text.trim()}
        >
          {loading ? 'Analyzing...' : 'Explain Math'}
        </button>
      </div>

      {explanations.length > 0 && (
        <div className="space-y-4">
          {explanations.map((item, i) => (
            <div key={i} className="card">
              <h4 className="font-mono bg-gray-100 p-2 rounded mb-3 break-all">
                {item.expression}
              </h4>
              <p className="text-gray-700">{item.explanation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
