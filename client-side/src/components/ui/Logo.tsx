import { motion } from 'framer-motion';

export default function Logo() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center"
    >
      <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#42d9fc] to-[#4364F7] text-xl font-bold text-white">
        B
      </div>
      <span className="text-xl font-bold text-gray-800">Bloogy</span>
    </motion.div>
  );
}
