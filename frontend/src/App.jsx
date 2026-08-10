import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { setAuthToken } from './api';
import { getToken, removeToken } from './utils';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PaperDetail from './pages/PaperDetail';
import LandingPage from './pages/LandingPage';
import Footer from './components/Footer';

function App() {
  useEffect(() => {
    const token = getToken();
    if (token) {
      setAuthToken(token);
    }
  }, []);

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const token = getToken();

  const handleLogout = () => {
    removeToken();
    setAuthToken(null);
    navigate('/login');
  };

  return (
    <>
      <div className="navbar">
        <div className="flex items-center space-x-2">
          <span className="text-[var(--accent)] font-bold text-xl">ResearchAI</span>
          <span className="w-2 h-2 bg-[var(--accent)] rounded-full" />
        </div>
        <div className="flex items-center space-x-3">
          {token ? (
            <>
              <span className="text-[var(--text-secondary)] cursor-pointer" onClick={handleLogout}>
                Logout
              </span>
            </>
          ) : (
            <>
              <Link to="/login" className="text-[var(--text-secondary)] hover:text-[var(--accent)]">
                Sign In
              </Link>
              <Link to="/register" className="text-[var(--text-secondary)] hover:text-[var(--accent)]">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/paper/:id"
            element={
              <ProtectedRoute>
                <PaperDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </>
  );
}
export default App;
