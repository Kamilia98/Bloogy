import { useState } from 'react';
import { Mail, Lock, UserPlus, Loader2, User, Eye, EyeOff } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import useAuth from '../contexts/AuthProvider';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/ui/Input';
import validateEmail from '../utlils/validateEmail';
import validatePassword from '../utlils/validatePassword';
export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const Auth = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [agreeToTermsError, setAgreeToTermsError] = useState('');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);

    if (!value) {
      setNameError('Name is required.');
    } else if (value.length < 2) {
      setNameError('Name must be at least 2 characters.');
    } else {
      setNameError('');
    }
  };

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
    } else if (value.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
    } else {
      setPasswordError('');
    }

    // Check confirm password match when password changes
    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
    } else if (confirmPassword) {
      setConfirmPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (!value) {
      setConfirmPasswordError('Please confirm your password.');
    } else if (value !== password) {
      setConfirmPasswordError('Passwords do not match.');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleAgreeToTerms = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgreeToTerms(e.target.checked);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let valid = true;

    if (!name) {
      setNameError('Name is required.');
      valid = false;
    } else if (name.length < 2) {
      setNameError('Name must be at least 2 characters.');
      valid = false;
    }

    if (!email) {
      setEmailError('Email is required.');
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    }

    if (!password) {
      if (!validatePassword(password)) {
        setPasswordError('Password must be at least 8 characters.');
      } else {
        setPasswordError('Password is required.');
      }
      valid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      valid = false;
    }

    if (!confirmPassword) {

      setConfirmPasswordError('Please confirm your password.');
      valid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match.');
      valid = false;
    }

    if (!agreeToTerms) {
      setAgreeToTermsError('You must agree to the terms and conditions.');
      valid = false;
    }

    if (!valid) return;

    setIsLoading(true);

    Auth.register(name, email, password)
      .then(() => {
        setIsLoading(false);
        navigate('/auth/login');
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  };

  return (
    <>
      {/* Welcome Text */}
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="mb-1 text-3xl font-bold text-gray-800">
          Create Account
        </h1>
        <p className="text-gray-600">
          Join Bloogy today to share your ideas with the world
        </p>
      </motion.header>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="space-y-4"
        aria-label="Sign up form"
      >
        {/* Name */}

        <Input
          id="name"
          label="Full name"
          placeholder="Your Name"
          value={name}
          onChange={handleNameChange}
          error={nameError}
          icon={<User size={20} />}
        />

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

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="relative">
            <Lock
              className="absolute inset-y-0 left-3 my-auto text-gray-500"
              size={20}
            />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create Password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 focus:ring-2 focus:ring-[#42d9fc] focus:outline-none"
              aria-required="true"
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
          {/* Password strength tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 rounded-md bg-gray-50 p-3"
          >
            <p className="mb-1 text-xs font-medium text-gray-700">
              Password must contain:
            </p>
            <ul className="space-y-1 text-xs text-gray-600">
              <li
                className={`flex items-center ${password.length >= 8 ? 'text-green-600' : ''}`}
              >
                <div
                  className={`mr-1 h-1.5 w-1.5 rounded-full ${password.length >= 8 ? 'bg-green-600' : 'bg-gray-400'}`}
                ></div>
                At least 8 characters
              </li>
              <li
                className={`flex items-center ${/[A-Z]/.test(password) ? 'text-green-600' : ''}`}
              >
                <div
                  className={`mr-1 h-1.5 w-1.5 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-600' : 'bg-gray-400'}`}
                ></div>
                One uppercase letter
              </li>
              <li
                className={`flex items-center ${/[a-z]/.test(password) ? 'text-green-600' : ''}`}
              >
                <div
                  className={`mr-1 h-1.5 w-1.5 rounded-full ${/[a-z]/.test(password) ? 'bg-green-600' : 'bg-gray-400'}`}
                ></div>
                One lowercase letter
              </li>
              <li
                className={`flex items-center ${/[0-9]/.test(password) ? 'text-green-600' : ''}`}
              >
                <div
                  className={`mr-1 h-1.5 w-1.5 rounded-full ${/[0-9]/.test(password) ? 'bg-green-600' : 'bg-gray-400'}`}
                ></div>
                One number
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <div className="relative">
            <Lock
              className="absolute inset-y-0 left-3 my-auto text-gray-500"
              size={20}
            />
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 focus:ring-2 focus:ring-[#42d9fc] focus:outline-none"
              aria-required="true"
            />
            {showConfirmPassword ? (
              <Eye
                className="absolute inset-y-0 right-3 my-auto cursor-pointer text-gray-500"
                size={20}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            ) : (
              <EyeOff
                className="absolute inset-y-0 right-3 my-auto cursor-pointer text-gray-500"
                size={20}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            )}
          </div>
          <AnimatePresence>
            {confirmPasswordError && (
              <motion.p
                key="confirmPasswordError"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-1 text-sm text-red-500"
              >
                {confirmPasswordError}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Terms */}
        <div className="mt-4 flex flex-col justify-between">
          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              checked={agreeToTerms}
              onChange={handleAgreeToTerms}
              className="h-4 w-4 rounded border-gray-300 text-[#4364F7] focus:ring-[#42d9fc]"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
              I agree to the{' '}
              <Link to="/terms" className="text-[#4364F7] hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-[#4364F7] hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>
          <AnimatePresence>
            {agreeToTermsError && (
              <motion.p
                key="agreeToTermsError"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-1 text-sm text-red-500"
              >
                {agreeToTermsError}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="mt-6 flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#4364F7] to-[#42d9fc] px-4 py-3 font-medium text-white transition duration-300 hover:from-[#3b58d9] hover:to-[#3bc7e8]"
        >
          {isLoading ? (
            <Loader2 className="mr-2 animate-spin" size={18} />
          ) : (
            <UserPlus className="mr-2" size={18} />
          )}
          Create Account
        </button>
      </motion.form>

      {/* Divider */}
      <motion.div
        className="my-6 flex items-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="flex-1 border-t border-gray-300" />
        <span className="px-4 text-sm text-gray-500">OR SIGN UP WITH</span>
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
          aria-label="Sign up with Google"
          className="flex flex-1 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition duration-300 hover:bg-gray-50"
        >
          <img src="/icons/google.svg" alt="Google" className="mr-2 h-5 w-5" />
          Google
        </button>

        {/* Facebook */}
        <button
          type="button"
          aria-label="Sign up with Facebook"
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
        className="mt-6 text-center text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Already have an account?{' '}
        <Link
          to="/auth/login"
          className="font-medium text-[#4364F7] hover:text-[#42d9fc] hover:underline"
        >
          Sign In
        </Link>
      </motion.div>
    </>
  );
}
