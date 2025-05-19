import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  if (!auth.isLoggedIn) {
    return <Navigate to="/" />;
  }
  return children;
};

export default RequireAuth;
