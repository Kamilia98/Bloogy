import { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Loader2, Check, AlertTriangle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import axios from 'axios';
import validatePassword from '../utlils/validatePassword';
import useAuth from '../contexts/AuthProvider';
export default function ResetPasswordPage() {
  const Auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [isTokenChecking, setIsTokenChecking] = useState(true);

  const [params] = useSearchParams();
  const navigate = useNavigate();

  // Simulate token validation
  useEffect(() => {
    if (!params.get('token')) {
      setIsTokenValid(false);
      setIsTokenChecking(false);
      return;
    }
    const validateToken = async () => {
      const token = params.get('token');
      if (!token) {
        setIsTokenValid(false);
        setIsTokenChecking(false);
        return;
      }
      try {
        await Auth.validateResetToken(token);
        setIsTokenValid(true);
        setIsTokenChecking(false);
      } catch (error) {
        setIsTokenValid(false);
        setIsTokenChecking(false);
      }
    };
    validateToken();
  }, [params]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (!value) {
      setPasswordError('Password is required.');
    } else {
      if (!validatePassword(value)) {
        setPasswordError('Password must be at least 8 characters.');
      } else {
        setPasswordError('');
      }
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

  const handleSubmit = () => {
    let valid = true;

    if (!password) {
      setPasswordError('Password is required.');
      valid = false;
    } else {
      if (!validatePassword(password)) {
        setPasswordError('Password must be at least 8 characters.');
        valid = false;
      }
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password.');
      valid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match.');
      valid = false;
    }

    if (!valid) return;

    setIsLoading(true);
  };

  if (isTokenChecking) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center text-center">
        <Loader2 className="mb-4 h-10 w-10 animate-spin text-[#4364F7]" />
        <p className="text-gray-600">Verifying your reset link...</p>
      </div>
    );
  }

  if (!isTokenValid) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle size={32} className="text-red-500" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-800">
          Invalid or Expired Link
        </h2>
        <p className="mb-8 text-gray-600">
          This password reset link is invalid or has expired.
        </p>
        <Link to="/auth/forget-password">
          <Button type="button" label="Request New Reset Link" />
        </Link>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="reset-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Welcome Text */}
            <motion.header
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8"
            >
              <h1 className="mb-1 text-3xl font-bold text-gray-800">
                Reset Password
              </h1>
              <p className="text-gray-600">Enter your new password below</p>
            </motion.header>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="space-y-6"
            >
              {/* Password */}
              <div>
                <div className="mb-1">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    New Password
                  </label>
                </div>
                <div className="relative">
                  <Lock
                    className="absolute inset-y-0 left-3 my-auto text-gray-500"
                    size={20}
                  />
                  <input
                    id="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="w-full rounded-lg border border-gray-300 py-3 pr-10 pl-10 focus:ring-2 focus:ring-[#42d9fc] focus:outline-none"
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
                <div className="mb-1">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                </div>
                <div className="relative">
                  <Lock
                    className="absolute inset-y-0 left-3 my-auto text-gray-500"
                    size={20}
                  />
                  <input
                    id="confirmPassword"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className="w-full rounded-lg border border-gray-300 py-3 pr-10 pl-10 focus:ring-2 focus:ring-[#42d9fc] focus:outline-none"
                    type={showConfirmPassword ? 'text' : 'password'}
                  />
                  {showConfirmPassword ? (
                    <Eye
                      className="absolute inset-y-0 right-3 my-auto cursor-pointer text-gray-500"
                      size={20}
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    />
                  ) : (
                    <EyeOff
                      className="absolute inset-y-0 right-3 my-auto cursor-pointer text-gray-500"
                      size={20}
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
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

              {/* Submit */}
              <div onClick={handleSubmit} className="cursor-pointer">
                <Button
                  type="button"
                  label="Reset Password"
                  icon={
                    isLoading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : null
                  }
                />
              </div>

              <div className="text-center text-sm text-gray-600">
                <Link
                  to="/auth/login"
                  className="font-medium text-[#4364F7] hover:text-[#42d9fc] hover:underline"
                >
                  Back to login
                </Link>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="success-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Check size={32} className="text-green-500" />
            </div>

            <h2 className="mb-2 text-2xl font-bold text-gray-800">
              Password Reset Successful
            </h2>
            <p className="mb-8 text-gray-600">
              Your password has been successfully updated.
            </p>

            <p className="mb-2 text-sm text-gray-500">
              Redirecting to login in 3 seconds...
            </p>

            <Link to="/auth/login">
              <Button type="button" label="Login Now" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
