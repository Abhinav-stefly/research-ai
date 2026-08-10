import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getToken } from '../utils';

export default function Landing() {
  const navigate = useNavigate();
  const token = getToken();

  useEffect(() => {
    if (token) {
      // already logged in -> go to dashboard
      navigate('/dashboard');
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-between pt-16">
      <header className="py-12 text-center">
        <h1 className="text-5xl font-bold">ResearchAI</h1>
        <p className="mt-4 text-xl text-[var(--text-muted)]">
          AI-powered tools to explore, summarize and understand academic papers.
        </p>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center space-y-6 px-4">
        <p className="max-w-2xl text-center">
          Upload your PDFs, generate summaries and explanations, analyze citation
          graphs, and speed up your literature review process with the help of
          state-of-the-art language models.
        </p>
        <div className="space-x-4">
          <Link to="/login" className="btn px-6 py-3">
            Sign In
          </Link>
          <Link to="/register" className="btn-secondary px-6 py-3">
            Register
          </Link>
        </div>
      </main>

      <footer className="py-6 text-center text-[var(--text-muted)] text-sm">
        © {new Date().getFullYear()} ResearchAI • Built for academic insights
      </footer>
    </div>
  );
}
