import { useState } from 'react';
import { Mail, Lock, LogIn, Loader2, Eye, EyeOff } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import useAuth from '../contexts/AuthProvider';
import { Link } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import validateEmail from '../utlils/validateEmail';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const Auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (!value) {
      setEmailError('Email is required.');
    } else if (!validateEmail(value)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (!value) {
      setPasswordError('Password is required.');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let valid = true;

    if (!email) {
      setEmailError('Email is required.');
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    }

    if (!password) {
      setPasswordError('Password is required.');
      valid = false;
    }

    if (!valid) return;

    setIsLoading(true);

    Auth.login(email, password, rememberMe)
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      {/* Welcome Text */}
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="mb-1 text-3xl font-bold text-gray-800">Welcome Back</h1>
        <p className="text-gray-600">
          Please login to your account to continue
        </p>
      </motion.header>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="space-y-6"
        aria-label="Login form"
      >
        {/* Email */}
        <Input
          id="email"
          label="Email Address"
          placeholder="Your Email"
          value={email}
          onChange={handleEmailChange}
          error={emailError}
          icon={<Mail size={20} />}
        />

        {/* Password */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Link
              to="/auth/forget-password"
              className="text-sm text-[#4364F7] hover:text-[#42d9fc]"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock
              className="absolute inset-y-0 left-3 my-auto text-gray-500"
              size={20}
            />
            <input
              id="password"
              placeholder="Your Password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 focus:ring-2 focus:ring-[#42d9fc] focus:outline-none"
              aria-required="true"
              type={showPassword ? 'text' : 'password'}
            />
            {showPassword ? (
              <Eye
                className="absolute inset-y-0 right-3 my-auto cursor-pointer text-gray-500"
                size={20}
                onClick={() => setShowPassword(!showPassword)}
              />
            ) : (
              <EyeOff
                className="absolute inset-y-0 right-3 my-auto cursor-pointer text-gray-500"
                size={20}
                onClick={() => setShowPassword(!showPassword)}
              />
            )}
          </div>
          <AnimatePresence>
            {passwordError && (
              <motion.p
                key="passwordError"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-1 text-sm text-red-500"
              >
                {passwordError}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Remember Me */}
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="h-4 w-4 rounded border-gray-300 text-[#4364F7] focus:ring-[#42d9fc]"
          />
          <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700">
            Remember me
          </label>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          label="Sign In"
          icon={
            isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <LogIn size={18} />
            )
          }
        />
      </motion.form>

      {/* Divider */}
      <motion.div
        className="my-8 flex items-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="flex-1 border-t border-gray-300" />
        <span className="px-4 text-sm text-gray-500">OR CONTINUE WITH</span>
        <div className="flex-1 border-t border-gray-300" />
      </motion.div>

      {/* Social Login */}
      <motion.div
        className="flex space-x-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {/* Google */}
        <button
          type="button"
          aria-label="Sign in with Google"
          className="flex flex-1 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition duration-300 hover:bg-gray-50"
        >
          <img src="/icons/google.svg" alt="Google" className="mr-2 h-5 w-5" />
          Google
        </button>

        {/* Facebook */}
        <button
          type="button"
          aria-label="Sign in with Facebook"
          className="flex flex-1 items-center justify-center rounded-lg border border-[#1877F2] bg-[#1877F2] px-4 py-3 font-medium text-white transition duration-300 hover:bg-[#0e6edf]"
        >
          <img
            src="/icons/facebook.svg"
            alt="Facebook"
            className="mr-2 h-5 w-5"
          />
          Facebook
        </button>
      </motion.div>

      <motion.div
        className="mt-8 text-center text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Don&apos;t have an account?{' '}
        <Link
          to="/auth/register"
          className="font-medium text-[#4364F7] hover:text-[#42d9fc] hover:underline"
        >
          Sign Up
        </Link>
      </motion.div>
    </>
  );
}
