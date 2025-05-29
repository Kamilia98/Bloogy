import { useState } from 'react';
import { Lock, Eye, EyeOff, Loader2, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import validatePassword from '../utlils/validatePassword';
import useAuth from '../contexts/AuthProvider';
import Input from '../components/ui/Input';
import PasswordTips from '../components/common/PasswordTips';
export default function ResetPasswordPage() {
  const Auth = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    let valid = true;

    if (!password) {
      setPasswordError('Password is required.');
      valid = false;
    } else if (!validatePassword(password)) {
      setPasswordError(
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number.',
      );
      valid = false;
    } else {
      setPasswordError('');
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
    Auth.resetPassword(password)
      .then(() => {
        setIsSubmitted(true);
        setIsLoading(false);
        setTimeout(() => {
          navigate('/auth/login');
        }, 3000);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error('Error resetting password:', error);
        setPasswordError('Failed to reset password. Please try again.');
      });
  };

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
              <div className="flex flex-col gap-2">
                <Input
                  id="password"
                  label="Password"
                  placeholder="Create Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={passwordError}
                  leftIcon={<Lock size={20} />}
                  rightIcon={
                    showPassword ? (
                      <Eye
                        onClick={() => setShowPassword(false)}
                        className="cursor-pointer text-gray-500"
                      />
                    ) : (
                      <EyeOff
                        onClick={() => setShowPassword(true)}
                        className="cursor-pointer text-gray-500"
                      />
                    )
                  }
                />

                {/* Password Strength Tips */}
                <PasswordTips password={password} />
              </div>

              {/* Confirm Password */}
              <Input
                id="confirmPassword"
                label="Confirm Password"
                placeholder="Re-enter Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={confirmPasswordError}
                leftIcon={<Lock size={20} />}
                rightIcon={
                  showConfirmPassword ? (
                    <Eye
                      onClick={() => setShowConfirmPassword(false)}
                      className="cursor-pointer text-gray-500"
                    />
                  ) : (
                    <EyeOff
                      onClick={() => setShowConfirmPassword(true)}
                      className="cursor-pointer text-gray-500"
                    />
                  )
                }
              />
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
                  className="font-medium text-primary hover:text-tertiary hover:underline"
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
