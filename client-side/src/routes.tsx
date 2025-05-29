import { useRoutes } from 'react-router-dom';
import HomePage from './pages/HomePage';
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
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import FeaturesPage from './pages/FeaturesPage';
import HelpCenterPage from './pages/HelpCenterPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import CookiesPage from './pages/CookiesPage';
import { LoginCallBack } from './pages/LoginCallBack';
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
          path: 'login/callback',
          element: (
            <RequireLoggedOut>
              <LoginCallBack />
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
        { path: '/', element: <HomePage /> },
        { path: '/blogs', element: <HomePage /> },
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
        {
          path: '/profile/:id',
          element: <ProfilePage />,
        },
        { path: '/about', element: <AboutPage /> },
        { path: '/features', element: <FeaturesPage /> },
        { path: '/help', element: <HelpCenterPage /> },
        { path: '/contact', element: <ContactPage /> },
        { path: '/privacy', element: <PrivacyPage /> },
        { path: '/terms', element: <TermsPage /> },
        { path: '/cookies', element: <CookiesPage /> },
      ],
    },

    { path: '*', element: <NotFoundPage /> },
  ]);

  return element;
};

export default ProjectRoutes;
