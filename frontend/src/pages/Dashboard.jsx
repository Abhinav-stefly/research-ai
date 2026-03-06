import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils';
import { paperAPI } from '../api';

export default function Dashboard() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInput = useRef(null);
  const token = getToken();
  const navigate = useNavigate();

  // Fetch existing papers on component mount
  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const res = await paperAPI.getPapers(token);
        setPapers(res.data.papers || []);
      } catch (err) {
        console.error('Failed to fetch papers:', err);
        // Don't show error for initial load
      }
    };

    if (token) {
      fetchPapers();
    }
  }, [token]);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const res = await paperAPI.upload(file, token);
      setPapers([res.data.paper, ...papers]);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Research AI</h1>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/login');
            }}
            className="btn-secondary"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        {/* Upload Section */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-4">Upload Paper</h2>
          
          {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}
          
          <div
            onClick={() => fileInput.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <p className="text-gray-600 mb-2">Click to select a PDF file</p>
            <input
              ref={fileInput}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              hidden
              disabled={loading}
            />
            {loading && <p className="text-blue-600 font-medium">Uploading...</p>}
          </div>
        </div>

        {/* Papers List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Papers</h2>
          {papers.length === 0 ? (
            <div className="card text-center text-gray-500">
              <p>No papers uploaded yet</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {papers.map(paper => (
                <div
                  key={paper._id}
                  onClick={() => navigate(`/paper/${paper._id}`)}
                  className="card cursor-pointer hover:shadow-lg"
                >
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{paper.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {new Date(paper.createdAt).toLocaleDateString()}
                  </p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Sections: {paper.sectionCount || 0}</p>
                    <p>Citations: {paper.citationCount || 0}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
