import { motion } from 'framer-motion';
export default function Hero() {
  return (
    <>
      <div className="flex h-screen items-center justify-between bg-white bg-[url('/images/header.jpg')] bg-cover bg-fixed bg-top bg-no-repeat p-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
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
      <div className="bg-gradient-to-b from-blue-50 to-white py-12  mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="mb-4 text-4xl font-bold text-gray-900">Our Blogs</h1>
          <p className="mx-auto mb-6 max-w-2xl text-lg text-gray-600">
            Explore the latest insights, tutorials, and updates from our team
          </p>
        </motion.div>

      </div>
    </>

  );
}
