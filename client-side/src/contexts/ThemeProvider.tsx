import { createContext, useContext, useEffect, useState } from 'react';

// ============================
// Context Interface
// ============================
interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

// ============================
// Context Setup
// ============================
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ============================
// Provider Component
// ============================
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.add(theme);
    return () => {
      document.documentElement.classList.remove(theme);
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ============================
// Custom Hook
// ============================
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default useTheme;
