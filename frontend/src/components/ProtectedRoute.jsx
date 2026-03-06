import { Navigate } from 'react-router-dom';
import { getToken } from '../utils';

export default function ProtectedRoute({ children }) {
  if (!getToken()) {
    return <Navigate to="/login" />;
  }
  return children;
}
