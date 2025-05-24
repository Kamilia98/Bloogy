import * as React from 'react';
import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utlils/cn';

interface ModalProps {
  setModalOpen: (open: boolean) => void;
  children: ReactNode;
}

function Modal({ setModalOpen, children }: ModalProps) {
  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={() => setModalOpen(false)}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
      >
        <div
          className="flex w-full max-w-lg flex-col gap-4 rounded-lg bg-white p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </motion.div>
    </>
  );
}

// Subcomponents
Modal.Header = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('mb-2 text-xl font-bold text-gray-800', className)}
    {...props}
  />
));
Modal.Header.displayName = 'Modal.Header';

Modal.Content = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
));
Modal.Content.displayName = 'Modal.Content';

Modal.Footer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex justify-end gap-2', className)}
    {...props}
  />
));
Modal.Footer.displayName = 'Modal.Footer';

export { Modal };
