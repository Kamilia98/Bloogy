import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Loader2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../contexts/AuthProvider';
import Button from '../components/ui/Button';
import Hero from '../components/Hero';
// Blog type definitions
import { CATEGORY, type Blog } from '../models/BlogModel';
import axios from 'axios';
import BlogCard from '../components/BlogCard';
import toast from 'react-hot-toast';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<CATEGORY | 'all'>('all');
  const Auth = useAuth();
  const navigate = useNavigate();

  // Categories - replace with your actual categories

  const blogsCategories: string[] = [];

  for (const cat in CATEGORY) {
    blogsCategories.push(cat as string);
  }

  const categories = ['all', ...blogsCategories];

  const fetchBlogs = async () => {
    try {
      const params: { category?: string; search?: string } = {};
      if (activeCategory !== 'all') params.category = activeCategory;
      if (searchTerm) params.search = searchTerm;
      // Replace with your actual API call
      const response = await axios.get('/api/blogs', {
        params,
      });
      const data = await response.data;
      setBlogs(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Filter blogs based on search and category
  useEffect(() => {
    fetchBlogs();
  }, [searchTerm, activeCategory]);

  const handleCreateBlog = () => {
    navigate('/blogs/add');
  };

  const handleEditBlog = (blogId: string) => {
    navigate(`/blogs/edit/${blogId}`);
  };

  const confirmDelete = (blog: Blog) => {
    setSelectedBlog(blog);
    setDeleteModalOpen(true);
  };

  const handleDeleteBlog = async () => {
    if (!selectedBlog || !Auth.token) return;

    try {
      await axios.delete(`/api/blogs/${selectedBlog._id}`, {
        headers: {
          Authorization: `Bearer ${Auth.token}`,
        },
      });

      // Optimistic update - remove the blog from state immediately
      setBlogs((prevBlogs) =>
        prevBlogs.filter((blog) => blog._id !== selectedBlog._id),
      );
      setDeleteModalOpen(false);
      setSelectedBlog(null);

      // Show success notification
      toast.success('Blog deleted successfully!');
    } catch (error) {
      console.error('Error deleting blog:', error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
          error.message ||
          'Failed to delete blog',
        );

        if (error.response?.status === 401) {
          Auth.logout();
        }
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  return (
    <>
      <Hero />

      <div className="bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="mb-4 text-4xl font-bold text-gray-900">Our Blog</h1>
            <p className="mx-auto mb-6 max-w-2xl text-lg text-gray-600">
              Explore the latest insights, tutorials, and updates from our team
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search and Filter */}
        <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="relative w-full md:max-w-xs">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category as CATEGORY | 'all')}
                className={`rounded-full px-4 py-1 text-sm font-medium ${activeCategory === category
                  ? 'bg-[#4364F7] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Create Blog Button (for logged-in users) */}
        {Auth.user && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8 flex justify-end"
          >
            <div>
              <Button
                onClick={handleCreateBlog}
                label="Create New Blog"
                icon={<PlusCircle size={18} />}
              />
            </div>
          </motion.div>
        )}

        {/* Blogs List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-6"
        >
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-[#4364F7]" size={40} />
            </div>
          ) : blogs.length === 0 ? (
            <div className="rounded-lg bg-gray-50 py-12 text-center">
              <p className="text-gray-600">
                {searchTerm || activeCategory !== 'all'
                  ? 'No blogs found matching your criteria.'
                  : 'No blogs found. Be the first to create one!'}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {blogs.map((blog, index) => (
                  <BlogCard
                    key={blog._id || index}
                    index={index}
                    blog={blog}
                    handleEditBlog={handleEditBlog}
                    confirmDelete={confirmDelete}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteModalOpen && (
            <DeleteConfirmationModal
              title={selectedBlog?.title || ''}
              setDeleteModalOpen={setDeleteModalOpen}
              handleDeleteBlog={handleDeleteBlog}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
