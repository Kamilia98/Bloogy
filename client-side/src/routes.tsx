import { useRoutes } from 'react-router-dom';
import BlogsPage from './pages/BlogsPage';
import BlogForm from './components/BlogForm';
import NotFoundPage from './pages/NotFoundPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
const ProjectRoutes = (): React.ReactNode => {
  const element = useRoutes([
    { path: '*', element: <NotFoundPage /> },
    { path: '/signup', element: <SignupPage /> },
    { path: '/login', element: <LoginPage /> },
    { path: '/', element: <BlogsPage /> },
    { path: '/blogs', element: <BlogsPage /> },
  ]);

  return element;
};

export default ProjectRoutes;
