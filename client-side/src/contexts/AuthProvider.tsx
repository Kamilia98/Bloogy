import {
  createContext,
  useState,
  useContext,
  type ReactNode,
  useMemo,
} from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import type { User } from '../models/UserModel';

// ============================
// Context Interface
// ============================
interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  onUserUpdate: (user: User) => void;
  login: (
    email: string,
    password: string,
    rememberMe: boolean,
  ) => Promise<void>;
  googleSignUp: () => void;
  facebookSignUp: () => void;
  checkGoogleLogin: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgetPassword: (email: string) => Promise<void>;
  resetPassword: (password: string) => Promise<void>;
  validateResetToken: (token: string) => Promise<any>;
}

// ============================
// Context Setup
// ============================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================
// Provider Component
// ============================
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const getInitialStorage = () => {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    const userStr =
      localStorage.getItem('user') || sessionStorage.getItem('user');
    return {
      token,
      user: userStr ? JSON.parse(userStr) : null,
      isLoggedIn: Boolean(token),
    };
  };

  const initial = useMemo(() => getInitialStorage(), []);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(initial.isLoggedIn);
  const [user, setUser] = useState<User | null>(initial.user);
  const [token, setToken] = useState<string | null>(initial.token);

  const handleError = (error: any, defaultMessage: string) => {
    toast.error(
      error?.response?.data?.message || error.message || defaultMessage,
    );
    throw error;
  };

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
  const login = async (
    email: string,
    password: string,
    rememberMe: boolean,
  ) => {
    try {
      await axios.post(
        `${BASE_URL}/auth/login`,
        { email, password },
        { withCredentials: true },
      );

      const response = await axios.get(`${BASE_URL}/auth/me`, {
        withCredentials: true,
      });
      const user = response.data;

      setIsLoggedIn(true);
      setUser(user);

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('user', JSON.stringify(user));

      toast.success('Logged in successfully!');
    } catch (error) {
      setIsLoggedIn(false);
      setUser(null);
      handleError(error, 'Login failed');
    }
  };

  const googleSignUp = () => window.open(`${BASE_URL}/auth/google`, '_self');
  const facebookSignUp = () =>
    window.open(`${BASE_URL}/auth/facebook`, '_self');

  const handleGoogleLogin = async () => {
    const response = await axios.get(`${BASE_URL}/auth/me`, {
      withCredentials: true,
    });
    const user = response.data;
    setIsLoggedIn(true);
    setUser(user);

    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem('user', JSON.stringify(user));

    toast.success('Logged in successfully!');
  };

  const checkGoogleLogin = () => {
    handleGoogleLogin();
  };

  const logout = async () => {
    try {
      await axios.post(
        `${BASE_URL}/auth/logout`,
        {},
        { withCredentials: true },
      );

      setIsLoggedIn(false);
      setUser(null);

      localStorage.clear();
      sessionStorage.clear();

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
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success('Password reset successfully!');
      setToken(null);
    } catch (error) {
      handleError(error, 'Password reset failed');
    }
  };

  const validateResetToken = async (resetToken: string) => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/auth/validate-reset-token/${resetToken}`,
      );
      setToken(resetToken);
      return data;
    } catch (error) {
      handleError(error, 'Reset token validation failed');
    }
  };

  const onUserUpdate = (updateedUser: User) => {
    if (user && user._id === updateedUser._id) {
      setUser(updateedUser);
      const storage = localStorage.getItem('user')
        ? localStorage
        : sessionStorage;
      storage.setItem('user', JSON.stringify(user));
    }
  };

  const authValues = useMemo(
    () => ({
      isLoggedIn,
      user,
      onUserUpdate,
      login,
      googleSignUp,
      facebookSignUp,
      checkGoogleLogin,
      logout,
      register,
      forgetPassword,
      resetPassword,
      validateResetToken,
    }),
    [isLoggedIn, token, user],
  );

  return (
    <AuthContext.Provider value={authValues}>
      {children}
      <Toaster />
    </AuthContext.Provider>
  );
};

// ============================
// Custom Hook
// ============================
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
