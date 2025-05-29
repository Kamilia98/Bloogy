import { useEffect, useState } from 'react';
import { Mail, Lock, LogIn, Loader2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import useAuth from '../contexts/AuthProvider';
import { Link } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import validateEmail from '../utlils/validateEmail';
import SocialLogin from '../components/common/SocialLogin';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const Auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

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
      .catch(() => {
        setIsLoading(false);
      });
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Text */}
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col gap-1"
      >
        <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
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
        className="flex flex-col gap-6"
        aria-label="Login form"
      >
        {/* Email */}
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
        <div className="flex flex-col items-end">
          <Link
            to="/auth/forget-password"
            className="w-auto self-end text-sm text-primary hover:text-tertiary"
          >
            Forgot password?
          </Link>
          <Input
            id="password"
            label="Password"
            placeholder="Your Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError}
            leftIcon={<Lock size={20} />}
            rightIcon={
              showPassword ? (
                <EyeOff
                  className="cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <Eye
                  className="cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )
            }
          />
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-2">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-tertiary"
          />
          <label htmlFor="remember-me" className="text-sm text-gray-700">
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
        className="flex items-center gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="flex-1 border-t border-gray-300" />
        <span className="text-sm text-gray-500">OR CONTINUE WITH</span>
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
        Don&apos;t have an account?{' '}
        <Link
          to="/auth/register"
          className="font-medium text-primary hover:text-tertiary hover:underline"
        >
          Sign Up
        </Link>
      </motion.div>
    </div>
  );
}
