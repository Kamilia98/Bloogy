import { useRoutes } from 'react-router-dom';
import BlogsPage from './pages/BlogsPage';
import NotFoundPage from './pages/NotFoundPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import RequireLoggedOut from './guards/RequireLoggedOut';
import BlogFormPage from './pages/BlogFormPage';
import AuthLayout from './layouts/AuthLayout';
import AppLayout from './layouts/AppLayout';
import RequireLoggedIn from './guards/RequireLoggedIn';
import ForgetPasswordPage from './pages/ForgetPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import BlogDetailsPage from './pages/BlogDetailsPage';
const ProjectRoutes = (): React.ReactNode => {
  const element = useRoutes([
    {
      path: '/auth',
      element: <AuthLayout />,
      children: [
        {
          path: 'register',
          element: (
            <RequireLoggedOut>
              <SignupPage />
            </RequireLoggedOut>
          ),
        },
        {
          path: 'login',
          element: (
            <RequireLoggedOut>
              <LoginPage />
            </RequireLoggedOut>
          ),
        },
        {
          path: 'forget-password',
          element: <ForgetPasswordPage />,
        },
        {
          path: 'reset-password',
          element: <ResetPasswordPage />,
        },
      ],
    },
    {
      path: '/',
      element: <AppLayout />,
      children: [
        { path: '/', element: <BlogsPage /> },
        { path: '/blogs', element: <BlogsPage /> },
        {
          path: '/blogs/add',
          element: (
            <RequireLoggedIn>
              <BlogFormPage />
            </RequireLoggedIn>
          ),
        },
        {
          path: '/blogs/edit/:id',
          element: (
            <RequireLoggedIn>
              <BlogFormPage />
            </RequireLoggedIn>
          ),
        },
        {
          path: '/blogs/:id',
          element: <BlogDetailsPage />,
        },
      ],
    },

    { path: '*', element: <NotFoundPage /> },
  ]);

  return element;
};

export default ProjectRoutes;
