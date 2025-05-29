import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import useAuth from '../../contexts/AuthProvider';
import Logo from '../ui/Logo';
import UserAvatar from '../common/UserAvatar';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const Auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    Auth.logout()
      .then(() => navigate('/auth/login'))
      .catch((error) => console.error('Logout failed:', error));
  };

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <nav
      className={`fixed top-0 z-30 w-full backdrop-blur-md transition-all duration-300 ${
        isScrolled ? 'bg-white/80 shadow-md' : 'bg-transparent'
      }`}
    >
      {/* <TestSlider/> */}
      <div className="container mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}

          <Logo />

          {/* <ThemeToggler /> */}

          {/* Desktop Auth Buttons */}
          <div className="hidden space-x-4 md:flex">
            {Auth.user ? (
              <>
                <Link
                  to={`/profile/${Auth.user._id}`}
                  className="flex items-center rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  <div className="flex h-8 w-8 items-center overflow-hidden rounded-full">
                    <UserAvatar user={Auth.user} />
                  </div>
                  <span className="ml-2">{Auth.user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-tertiary"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 transition hover:text-primary"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden md:hidden"
          >
            <div className="bg-white shadow-md">
              <div className="container mx-auto max-w-7xl px-4 py-4">
                {Auth.user ? (
                  <div className="flex space-x-2 text-gray-700">
                    <Link
                      to={`/profile/${Auth.user._id}`}
                      className="flex-1/2 flex items-center rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                    >
                      <div className="flex h-8 w-8 items-center overflow-hidden rounded-full">
                        <UserAvatar user={Auth.user} />
                      </div>
                      <span className="ml-2">{Auth.user.name}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Link
                      to="/auth/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex justify-center rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                    >
                      Login
                    </Link>
                    <Link
                      to="/auth/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-tertiary"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
