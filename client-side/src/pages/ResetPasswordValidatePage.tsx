import { useState, useEffect } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import useAuth from '../contexts/AuthProvider';
export default function ResetPasswordValidatePage() {
  const Auth = useAuth();
  const navigate = useNavigate();
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [isTokenChecking, setIsTokenChecking] = useState(true);

  const [params] = useSearchParams();

  useEffect(() => {
    if (!params.get('token')) {
      setIsTokenValid(false);
      setIsTokenChecking(false);
      return;
    }

    const validateToken = async () => {
      const token = params.get('token');
      if (!token) {
        setIsTokenValid(false);
        setIsTokenChecking(false);
        return;
      }
      Auth.validateResetToken(token)
        .then(() => {
          setIsTokenValid(true);
          setIsTokenChecking(false);
          navigate('/auth/reset-password', { replace: true });
        })
        .catch(() => {
          setIsTokenValid(false);
          setIsTokenChecking(false);
        });
    };

    validateToken();
  }, [params]);

  if (isTokenChecking) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center text-center">
        <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
        <p className="text-gray-600">Verifying your reset link...</p>
      </div>
    );
  }

  if (!isTokenValid) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle size={32} className="text-red-500" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-800">
          Invalid or Expired Link
        </h2>
        <p className="mb-8 text-gray-600">
          This password reset link is invalid or has expired.
        </p>
        <Link to="/auth/forget-password">
          <Button type="button" label="Request New Reset Link" />
        </Link>
      </div>
    );
  }
}
