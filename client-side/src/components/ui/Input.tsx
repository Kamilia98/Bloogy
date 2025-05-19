import { motion, AnimatePresence } from 'framer-motion';
import { cloneElement, isValidElement, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
}

export default function Input({ label, icon, error, ...props }: InputProps) {
  const iconWithProps =
    isValidElement(icon) &&
    cloneElement(icon as React.ReactElement<{ className?: string }>, {
      className:
        'absolute inset-y-0 left-3 text-gray-500 my-auto ' +
        ((icon.props as { className?: string })?.className || ''),
    });

  return (
    <div>
      <label
        htmlFor={props.id}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="relative">
        {iconWithProps}
        <input
          {...props}
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} rounded-lg border border-gray-300 py-3 pr-4 focus:ring-2 focus:ring-[#42d9fc] focus:outline-none`}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-1 text-sm text-red-500"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
