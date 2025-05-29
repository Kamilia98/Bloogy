import {
  createContext,
  useState,
  useContext,
  type ReactNode,
  useMemo,
  useEffect,
} from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import type { User } from '../models/UserModel';
import Loading from '../components/common/Loading';

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  isLoading: boolean;
  onUserUpdate: (user: User) => void;
  login: (email: string, password: string) => Promise<void>;
  googleSignUp: () => void;
  facebookSignUp: () => void;
  handleGoogleLogin: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgetPassword: (email: string) => Promise<void>;
  resetPassword: (password: string) => Promise<void>;
  validateResetToken: (token: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

  const [authState, setAuthState] = useState<{
    isLoggedIn: boolean;
    user: User | null;
    isLoading: boolean;
  }>({
    isLoggedIn: false,
    user: null,
    isLoading: true,
  });

  const [resetToken, setRestToken] = useState<string | null>();

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/auth/isAuthenticated`, {
        withCredentials: true,
      });

      if (response.data.isAuthenticated) {
        return {
          isLoggedIn: true,
          user: response.data.user,
        };
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
    return { isLoggedIn: false, user: null };
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const authStatus = await checkAuthStatus();
      setAuthState({
        ...authStatus,
        isLoading: false,
      });
    };

    initializeAuth();
  }, []);

  const handleError = (error: any, defaultMessage: string) => {
    toast.error(
      error?.response?.data?.message || error.message || defaultMessage,
    );
    throw error;
  };

  const login = async (email: string, password: string) => {
    try {
      await axios.post(
        `${BASE_URL}/auth/login`,
        { email, password },
        { withCredentials: true },
      );

      const { data: user } = await axios.get(`${BASE_URL}/auth/me`, {
        withCredentials: true,
      });

      setAuthState({
        isLoggedIn: true,
        user,
        isLoading: false,
      });

      toast.success('Logged in successfully!');
    } catch (error) {
      setAuthState({
        isLoggedIn: false,
        user: null,
        isLoading: false,
      });
      handleError(error, 'Login failed');
    }
  };

  const googleSignUp = () => window.open(`${BASE_URL}/auth/google`, '_self');
  const facebookSignUp = () =>
    window.open(`${BASE_URL}/auth/facebook`, '_self');

  const handleGoogleLogin = async () => {
    try {
      const { data: user } = await axios.get(`${BASE_URL}/auth/me`, {
        withCredentials: true,
      });

      setAuthState({
        isLoggedIn: true,
        user,
        isLoading: false,
      });

      toast.success('Logged in successfully!');
    } catch (error) {
      setAuthState({
        isLoggedIn: false,
        user: null,
        isLoading: false,
      });
      handleError(error, 'Google login failed');
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${BASE_URL}/auth/logout`,
        {},
        { withCredentials: true },
      );

      setAuthState({
        isLoggedIn: false,
        user: null,
        isLoading: false,
      });

      toast.success('Logged out successfully!');
    } catch (error) {
      handleError(error, 'Logout failed');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await axios.post(
        `${BASE_URL}/auth/register`,
        { name, email, password },
        { withCredentials: true },
      );
      toast.success('Registered successfully!');
    } catch (error) {
      handleError(error, 'Registration failed');
    }
  };

  const forgetPassword = async (email: string) => {
    try {
      await axios.post(`${BASE_URL}/auth/forget-password`, { email });
      toast.success('Password reset email sent!');
    } catch (error) {
      handleError(error, 'Password reset failed');
    }
  };

  const resetPassword = async (password: string) => {
    try {
      await axios.post(
        `${BASE_URL}/auth/reset-password`,
        { password },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resetToken}`,
          },
        },
      );
      toast.success('Password reset successfully!');
      setRestToken(null);
    } catch (error) {
      handleError(error, 'Password reset failed');
    }
  };

  const validateResetToken = async (resetToken: string) => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/auth/validate-reset-token/${resetToken}`,
      );
      setRestToken(resetToken);
      return data;
    } catch (error) {
      handleError(error, 'Reset token validation failed');
    }
  };

  const onUserUpdate = (updatedUser: User) => {
    if (authState.user && authState.user._id === updatedUser._id) {
      setAuthState((prev) => ({ ...prev, user: updatedUser }));
    }
  };

  const authValues = useMemo(
    () => ({
      isLoggedIn: authState.isLoggedIn,
      user: authState.user,
      isLoading: authState.isLoading,
      onUserUpdate,
      login,
      googleSignUp,
      facebookSignUp,
      handleGoogleLogin,
      logout,
      register,
      forgetPassword,
      resetPassword,
      validateResetToken,
    }),
    [authState, resetToken],
  );

  if (authState.isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authValues}>
      {children}
      <Toaster />
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
