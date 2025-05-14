import './App.css';
import BlogForm from './components/BlogForm';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';
import ProjectRoutes from './routes.tsx';

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <ProjectRoutes />
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
