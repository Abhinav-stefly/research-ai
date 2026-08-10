import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, formatDate } from '../utils';
import { paperAPI } from '../api';

export default function Dashboard() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInput = useRef(null);
  const token = getToken();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const res = await paperAPI.getPapers(token);
        setPapers(res.data.papers || []);
      } catch (err) {
        console.error('Failed to fetch papers:', err);
      }
    };
    if (token) fetchPapers();
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
    <div className="min-h-screen">
      <div className="container">
        {/* Header */}
        <div className="mb-4">
          <h1 className="page-title">Your Research Library</h1>
          <p className="text-[var(--text-muted)]">Manage your collection of papers</p>
        </div>
        {/* Dashboard nav */}
        <nav className="mb-8">
          <ul className="flex space-x-4 text-[var(--accent)]">
            <li className="cursor-pointer hover:underline">Upload</li>
            <li className="cursor-pointer hover:underline">Your Papers</li>
          </ul>
        </nav>

        {/* Upload Section */}
        <div className="card mb-8">
          <h2 className="section-header mb-4">Upload Paper</h2>
          {error && <div className="bg-red-600 text-white p-3 rounded-lg mb-4">{error}</div>}
          <div
            onClick={() => fileInput.current?.click()}
            className="border-2 border-dashed border-[rgba(59,130,246,0.3)] rounded-lg p-8 text-center cursor-pointer hover:border-[var(--accent)] hover:bg-[rgba(59,130,246,0.1)] transition-colors"
          >
            <p className="text-[var(--text-muted)] mb-2">Click to select a PDF file</p>
            <input
              ref={fileInput}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              hidden
              disabled={loading}
            />
            {loading && <p className="text-[var(--accent)] font-medium">Uploading...</p>}
          </div>
        </div>

        {/* Papers List */}
        <div>
          <h2 className="section-header mb-4">Your Papers</h2>
          {papers.length === 0 ? (
            <div className="card text-center text-[var(--text-muted)]">
              <svg className="mx-auto mb-4 w-12 h-12 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6m3 6V9m3 8V5" /></svg>
              <p>Upload your first paper to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {papers.map(paper => (
                <div
                  key={paper._id}
                  onClick={() => navigate(`/paper/${paper._id}`)}
                  className="card flex justify-between items-center cursor-pointer"
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-lg line-clamp-2">{paper.title}</h3>
                  </div>
                  <div className="flex items-center space-x-2 text-xs font-mono text-[var(--text-muted)]">
                    <span>{formatDate(paper.createdAt)}</span>
                    <span>{paper.sections ? Object.keys(paper.sections).length : 0} sections</span>
                    <span>{paper.citations ? paper.citations.length : 0} cites</span>
                    <span className="text-[var(--accent)]">→</span>
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
