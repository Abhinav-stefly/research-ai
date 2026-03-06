import { useState } from 'react';
import { aiAPI } from '../../api';

export default function ExplainTab({ paperId, level, token }) {
  const [text, setText] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExplain = async () => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await aiAPI.explain(text, level, token);
      setExplanation(res.data.explanation);
    } catch (err) {
      console.error('Explain failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="card">
        <label className="block text-sm font-medium mb-2">Text to Explain</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="input min-h-32"
          placeholder="Paste or type the text you want explained..."
        />
        <button
          onClick={handleExplain}
          className="btn-primary mt-4"
          disabled={loading || !text.trim()}
        >
          {loading ? 'Explaining...' : `Explain (${level === 'eli5' ? 'Simple' : 'Advanced'})`}
        </button>
      </div>

      {explanation && (
        <div className="card">
          <h3 className="font-bold text-lg mb-3">Explanation</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{explanation}</p>
        </div>
      )}
    </div>
  );
}
