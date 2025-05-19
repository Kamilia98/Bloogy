import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import useAuth from '../contexts/AuthProvider';
import Logo from './ui/Logo';

export default function AppNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const Auth = useAuth();
  const navigate = useNavigate();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    Auth.logout().then(() => {
      navigate('/auth/login');
    });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav
      className={`fixed top-0 z-30 w-full transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Logo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          {/* <div className="hidden md:flex md:items-center md:space-x-8">
            
            <Link
              to="/"
              className="font-medium text-gray-700 hover:text-[#4364F7]"
            >
              Home
            </Link>
            <Link
              to="/blogs"
              className="font-medium text-gray-700 hover:text-[#4364F7]"
            >
              Blogs
            </Link>
            <Link
              to="/about"
              className="font-medium text-gray-700 hover:text-[#4364F7]"
            >
              About
            </Link>
          </div> */}

          {/* Auth Buttons (Desktop) */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {Auth.user ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm font-medium text-gray-700">
                  Hello, {Auth.user.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="rounded-full px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="rounded-full bg-[#4364F7] px-4 py-2 text-sm font-medium text-white hover:bg-[#3854c7]"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-[#4364F7]"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full w-full bg-white shadow-lg md:hidden">
          <div className="container mx-auto max-w-7xl px-4 py-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="py-2 font-medium text-gray-700 hover:text-[#4364F7]"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/blogs"
                className="py-2 font-medium text-gray-700 hover:text-[#4364F7]"
                onClick={() => setIsMenuOpen(false)}
              >
                Blogs
              </Link>
              <Link
                to="/about"
                className="py-2 font-medium text-gray-700 hover:text-[#4364F7]"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>

              <div className="pt-4">
                {Auth.user ? (
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-2">
                      <User size={16} className="text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {Auth.user.name}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center justify-center rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Link
                      to="/login"
                      className="flex w-full items-center justify-center rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="flex w-full items-center justify-center rounded-full bg-[#4364F7] px-4 py-2 text-sm font-medium text-white hover:bg-[#3854c7]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
