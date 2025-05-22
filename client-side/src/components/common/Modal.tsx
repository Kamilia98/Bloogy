import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ModalProps {
  setModalOpen: (open: boolean) => void;
  children: ReactNode;
}

export function Modal({ setModalOpen, children }: ModalProps) {
  return (
    <>
      <div
        className="bg-opacity-50 fixed inset-0 z-40 bg-black/50"
        onClick={() => setModalOpen(false)}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
      >
        <div className="flex w-full max-w-lg flex-col gap-4 rounded-lg bg-white p-6 shadow-xl">
          {children}
        </div>
      </motion.div>
    </>
  );
}
