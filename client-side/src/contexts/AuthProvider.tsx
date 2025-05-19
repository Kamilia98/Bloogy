import {
  createContext,
  useState,
  useContext,
  type ReactNode,
  useEffect,
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
  token: string | null;
  user: User | null;
  login: (
    email: string,
    password: string,
    rememberMe: boolean,
  ) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  forgetPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, password: string) => Promise<void>;
  validateResetToken: (token: string) => Promise<void>;
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
   const user = localStorage.getItem('user') || sessionStorage.getItem('user');
   const isLoggedIn = !!token;

   return {
     token,
     user: user && typeof user === 'string' ? JSON.parse(user) : user,
     isLoggedIn,
   };
 };

  const initial = useMemo(() => getInitialStorage(), []);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(initial.isLoggedIn);
  const [user, setUser] = useState<User | null>(initial.user);
  const [token, setToken] = useState<string | null>(initial.token);

  // ============================
  // Auth Functions
  // ============================

  useEffect(() => {
    console.log('user', user);
  }, [user]);
  const login = async (
    email: string,
    password: string,
    rememberMe: boolean,
  ) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;

      setIsLoggedIn(true);
      setToken(token);
      setUser(user);

      // Clear both storages first
      localStorage.clear();
      sessionStorage.clear();

      console.log(rememberMe);

      if (rememberMe) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(user));
      }

      toast.success('Logged in successfully!');
    } catch (error: any) {
      setIsLoggedIn(false);
      setToken(null);
      setUser(null);
      toast.error(
        error?.response?.data?.message || error.message || 'Login failed',
      );
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        '/api/auth/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setIsLoggedIn(false);
      setToken(null);
      setUser(null);

      localStorage.clear();
      sessionStorage.clear();

      toast.success('Logged out successfully!');
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error.message || 'Logout failed',
      );
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await axios.post('/api/auth/register', {
        name,
        email,
        password,
      });
      toast.success('Registered successfully!');
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          'Registration failed',
      );
      throw error;
    }
  };

  const forgetPassword = async (email: string) => {
    try {
      await axios.post('/api/auth/forget-password', { email });
      toast.success('Password reset email sent!');
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          'Password reset failed',
      );
      throw error;
    }
  };

  const resetPassword = async (email: string, password: string) => {
    try {
      await axios.post('/api/auth/reset-password', { email, password });
      toast.success('Password reset successfully!');
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          'Password reset failed',
      );
      throw error;
    }
  };

  const validateResetToken = async (token: string) => {
    try {
      const response = await axios.get(
        `/api/auth/validate-reset-token/${token}`,
      );
      return response.data;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          'Password reset failed',
      );
      console.log(error);
      throw error;
    }
  };

  // ============================
  // Context Value
  // ============================
  const authValues: AuthContextType = {
    isLoggedIn,
    token,
    user,
    login,
    logout,
    register,
    forgetPassword,
    resetPassword,
    validateResetToken,
  };

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
