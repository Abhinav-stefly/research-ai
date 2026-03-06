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

  if (loading) return <div className="card text-center">Finding similar papers...</div>;

  return (
    <div className="space-y-4">
      {similar.length === 0 ? (
        <div className="card text-center text-gray-500">
          No similar papers found
        </div>
      ) : (
        similar.map((paper, i) => (
          <div key={paper.paperId} className="card">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">{i + 1}. {paper.title}</h3>
                <p className="text-sm text-gray-600">
                  Similarity Score: <span className="font-semibold">{(paper.similarity * 100).toFixed(1)}%</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(paper.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center ml-4">
                <span className="text-2xl font-bold text-blue-600">
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
