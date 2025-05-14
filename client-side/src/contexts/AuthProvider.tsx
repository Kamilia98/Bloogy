import {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
} from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

// ============================
// Types
// ============================
interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
}

// ============================
// Context Setup
// ============================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================
// Provider Component
// ============================
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    () => localStorage.getItem('isLoggedIn') === 'true',
  );

  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('token'),
  );

  // ============================
  // Local Storage Sync
  // ============================
  useEffect(() => {
    localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  // ============================
  // Auth Functions
  // ============================
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { token, user } = response.data;

      setIsLoggedIn(true);
      setToken(token);
      setUser(user);

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
      console.log(token);
      await axios.post(
        '/auth/logout',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setIsLoggedIn(false);
      setToken(null);
      setUser(null);
      toast.success('Logged out successfully!');
    } catch (error: any) {
      console.log('error', error);
      toast.error(
        error?.response?.data?.message || error.message || 'Logout failed',
      );
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
  ) => {
    try {
      await axios.post('/auth/register', { name: username, email, password });
      toast.success('Registered successfully!');
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          'Registration failed',
      );
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
