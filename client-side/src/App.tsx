import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';
import ProjectRoutes from './routes.tsx';
import ScrollToTop from './ScrollToTop.tsx';
import { ThemeProvider } from './contexts/ThemeProvider.tsx';

function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <ThemeProvider>
          <AuthProvider>
            <ProjectRoutes />
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </>
  );
}

export default App;
