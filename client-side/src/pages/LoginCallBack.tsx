import { useEffect } from 'react';
import useAuth from '../contexts/AuthProvider';

export const LoginCallBack = () => {
  const Auth = useAuth();
  useEffect(() => {
    Auth.handleGoogleLogin();
  }, []);
  return <></>;
};
