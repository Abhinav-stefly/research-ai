import { useState, useEffect } from 'react';
import { aiAPI } from '../../api';

export default function SimilarTab({ paperId, token }) {
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const res = await aiAPI.getSimilar(paperId, 5, token);
        setSimilar(res.data.similar || []);
      } catch (err) {
        console.error('Failed to load similar papers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilar();
  }, [paperId, token]);

  if (loading) return <div className="card text-center text-[var(--text-secondary)]">Finding similar papers...</div>;

  return (
    <div className="space-y-4">
      {similar.length === 0 ? (
        <div className="card text-center text-[var(--text-muted)]">
          No similar papers found
        </div>
      ) : (
        similar.map((paper, i) => (
          <div key={paper.paperId} className="card">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">{i + 1}. {paper.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Similarity Score: <span className="font-semibold">{(paper.similarity * 100).toFixed(1)}%</span>
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {new Date(paper.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="w-16 h-16 bg-[rgba(59,130,246,0.2)] rounded-lg flex items-center justify-center ml-4">
                <span className="text-2xl font-bold text-[var(--accent)]">
                  {(paper.similarity * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
