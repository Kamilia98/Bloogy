import { Link } from 'react-router-dom';
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Github,
  Twitter,
  Linkedin,
} from 'lucide-react';
import Logo from './ui/Logo';

export default function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        {/* Main Footer Content */}
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <Logo />
            <p className="text-sm leading-relaxed text-gray-600">
              Building amazing experiences for our users. Connect, share, and
              grow with our platform.
            </p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="hover:border-primary hover:text-primary rounded-full border border-gray-200 bg-white p-2 text-gray-600 transition-all duration-200"
                aria-label="Follow us on Twitter"
              >
                <Twitter size={16} />
              </a>
              <a
                href="#"
                className="hover:border-primary hover:text-primary rounded-full border border-gray-200 bg-white p-2 text-gray-600 transition-all duration-200"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="#"
                className="hover:border-primary hover:text-primary rounded-full border border-gray-200 bg-white p-2 text-gray-600 transition-all duration-200"
                aria-label="View our GitHub"
              >
                <Github size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="hover:text-primary text-sm text-gray-600 transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/features"
                  className="hover:text-primary text-sm text-gray-600 transition-colors duration-200"
                >
                  Features
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/help"
                  className="hover:text-primary text-sm text-gray-600 transition-colors duration-200"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-primary text-sm text-gray-600 transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-primary text-sm text-gray-600 transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-primary text-sm text-gray-600 transition-colors duration-200"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="rounded-full border border-gray-200 bg-white p-2">
                  <Mail size={14} className="text-gray-600" />
                </div>
                <span className="text-sm text-gray-600">
                  kamiliaahmed01@gmail.com
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="rounded-full border border-gray-200 bg-white p-2">
                  <Phone size={14} className="text-gray-600" />
                </div>
                <span className="text-sm text-gray-600">+20 1124529888</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="rounded-full border border-gray-200 bg-white p-2">
                  <MapPin size={14} className="text-gray-600" />
                </div>
                <span className="text-sm text-gray-600">Cairo, Egypt</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col items-center justify-between space-y-2 md:flex-row md:space-y-0">
            <p className="flex items-center text-sm text-gray-600">
              © {currentYear} Bloogy Made with{' '}
              <Heart
                size={14}
                className="mx-1 text-red-500"
                fill="currentColor"
              />{' '}
              by Kamilia.
            </p>
            <div className="flex space-x-6">
              <Link
                to="/privacy"
                className="hover:text-primary text-sm text-gray-600 transition-colors duration-200"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="hover:text-primary text-sm text-gray-600 transition-colors duration-200"
              >
                Terms
              </Link>
              <Link
                to="/cookies"
                className="hover:text-primary text-sm text-gray-600 transition-colors duration-200"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
