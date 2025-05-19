import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';
import { ThemeProvider } from './contexts/ThemeProvider';
import ProjectRoutes from './routes.tsx';
function App() {
  return (
    <>
      <Router>
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
