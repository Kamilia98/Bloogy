import { motion } from 'framer-motion';

export default function Logo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30, rotate: -10, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="flex cursor-pointer items-center"
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
        className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#42d9fc] to-[#4364F7] text-xl font-bold text-white shadow-md"
      >
        B
      </motion.div>
      <motion.span
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-xl font-bold text-gray-800"
      >
        Bloogy
      </motion.span>
    </motion.div>
  );
}
