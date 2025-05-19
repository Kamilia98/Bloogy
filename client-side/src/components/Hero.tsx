import { motion } from 'framer-motion';
export default function Hero() {
  return (
    <div className="flex h-screen items-center justify-between bg-white bg-[url('/images/header.jpg')] bg-cover bg-fixed bg-top bg-no-repeat p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-primary/20 flex max-w-2xl flex-col gap-4 rounded-xl p-12"
      >
        <h1 className="mb-2 text-4xl font-bold text-gray-800">
          Bloogy Platform
        </h1>
        <p className="text-gray-600">
          Welcome to Bloogy — your space to express, explore, and inspire.
          <br />
          <br />
          Create your own blog, share your voice with the world, and connect
          with a community of readers and writers.
          <br />
        </p>
      </motion.div>
    </div>
  );
}
