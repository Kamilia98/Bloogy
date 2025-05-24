import { useState } from 'react';
import { Mail, ArrowLeft, Loader2, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import validateEmail from '../utlils/validateEmail';
import useAuth from '../contexts/AuthProvider';
export default function ForgotPasswordPage() {
  const Auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleResendEmail = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    Auth.forgetPassword(email)
      .then(() => {
        setIsSubmitted(true);
      })
      .catch((error) => {
        console.error('Error sending reset link:', error);
        setIsSubmitted(false);
      });
  };

  const handleSubmit = () => {
    let valid = true;

    if (!email) {
      setEmailError('Email is required.');
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    }

    if (!valid) return;

    setIsLoading(true);

    Auth.forgetPassword(email)
      .then(() => {
        setIsSubmitted(true);
        setEmailError('');
      })
      .catch((error) => {
        console.error('Error sending reset link:', error);
        setEmailError('Failed to send reset link. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <Link
          to="/auth/login"
          className="hover:text-primary inline-flex items-center text-sm text-gray-600"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to login
        </Link>
      </motion.div>

      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="request-form"
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
                Forgot Password?
              </h1>
              <p className="text-gray-600">
                Enter your email address and we'll send you a link to reset your
                password
              </p>
            </motion.header>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="space-y-6"
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

              {/* Submit */}
              <div onClick={handleSubmit} className="cursor-pointer">
                <Button
                  type="button"
                  label="Send Reset Link"
                  icon={
                    isLoading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : null
                  }
                />
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
              Check Your Email
            </h2>
            <p className="mb-8 text-gray-600">
              We've sent a password reset link to
              <br />
              <span className="font-medium text-gray-800">{email}</span>
            </p>

            <p className="mb-6 text-sm text-gray-500">
              Didn't receive the email? Check your spam folder or
            </p>

            <div
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                }, 1500);
              }}
              className="cursor-pointer"
            >
              <Button
                type="button"
                label={isLoading ? 'Sending...' : 'Resend Email'}
                icon={
                  isLoading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : null
                }
                disabled={isLoading}
                onClick={handleResendEmail}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
