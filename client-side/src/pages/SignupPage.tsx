import { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Loader2, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../contexts/AuthProvider';
import Input from '../components/ui/Input';
import validateEmail from '../utlils/validateEmail';
import validatePassword from '../utlils/validatePassword';
import SocialLogin from '../components/common/SocialLogin';
import Button from '../components/ui/Button';
import PasswordTips from '../components/common/PasswordTips';

export default function SignupPage() {
  const navigate = useNavigate();
  const Auth = useAuth();

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validation Errors
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [agreeToTermsError, setAgreeToTermsError] = useState('');

  const validateFields = () => {
    let valid = true;

    if (!name) {
      setNameError('Name is required.');
      valid = false;
    } else if (name.length < 2) {
      setNameError('Name must be at least 2 characters.');
      valid = false;
    } else {
      setNameError('');
    }

    if (!email) {
      setEmailError('Email is required.');
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    } else {
      setEmailError('');
    }

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
    } else {
      setConfirmPasswordError('');
    }

    if (!agreeToTerms) {
      setAgreeToTermsError('You must agree to the terms and conditions.');
      valid = false;
    } else {
      setAgreeToTermsError('');
    }

    return valid;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateFields()) return;

    setIsLoading(true);
    Auth.register(name, email, password)
      .then(() => {
        setIsLoading(false);
        navigate('/auth/login');
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error);
      });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col gap-1"
      >
        <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
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
        className="flex flex-col gap-4"
        aria-label="Sign up form"
      >
        <Input
          id="name"
          label="Full Name"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={nameError}
          leftIcon={<User size={20} />}
        />

        <Input
          id="email"
          label="Email Address"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
          leftIcon={<Mail size={20} />}
        />

        {/* Password */}
        <div className="flex flex-col gap-0.5">
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

        {/* Agree to Terms */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <input
              id="terms"
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="text-primary h-4 w-4"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I agree to the{' '}
              <Link to="/terms" className="text-blue-600 underline">
                terms and conditions
              </Link>
              .
            </label>
          </div>
          {agreeToTermsError && (
            <p className="text-sm text-red-600">{agreeToTermsError}</p>
          )}
        </div>

        {/* Submit */}

        <Button
          variant="primary"
          type="submit"
          label={isLoading ? 'Creating Account...' : 'Create Account'}
          icon={
            isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <UserPlus size={18} />
            )
          }
        />
      </motion.form>

      {/* Divider */}
      <motion.div
        className="flex items-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="flex-1 border-t border-gray-300" />
        <span className="px-4 text-sm text-gray-500">OR SIGN UP WITH</span>
        <div className="flex-1 border-t border-gray-300" />
      </motion.div>

      {/* Social Login */}
      <SocialLogin />

      <motion.div
        className="text-center text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Already have an account?{' '}
        <Link
          to="/auth/login"
          className="text-primary hover:text-tertiary font-medium hover:underline"
        >
          Sign In
        </Link>
      </motion.div>
    </div>
  );
}
