import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../contexts/AuthProvider';
import Button from '../components/ui/Button';
import Hero from '../components/Hero';
// Blog type definitions
import { CATEGORY, type Blog } from '../models/BlogModel';
import { useDispatch, useSelector } from 'react-redux';
import { deleteBlog, fetchBlogs } from '../store/features/blogs/blogsSlice';
import BlogCard from '../components/BlogCard';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';
import type { AppDispatch, RootState } from '../store';
import Loading from '../components/common/Loading';
import toast from 'react-hot-toast';

export default function BlogsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const Auth = useAuth();

  // Select blogs and status from Redux store
  const blogs = useSelector((state: RootState) => state.blogs.items);
  const status = useSelector((state: RootState) => state.blogs.status);

  // Local states for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<CATEGORY | 'all'>('all');

  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  const blogsCategories: string[] = Object.keys(CATEGORY);
  const categories = ['all', ...blogsCategories];

  useEffect(() => {
    const params: Record<string, any> = {};

    if (searchTerm) {
      params.search = searchTerm;
    }
    if (activeCategory !== 'all') {
      params.category = activeCategory;
    }

    dispatch(fetchBlogs(params));
  }, [searchTerm, activeCategory, dispatch]);

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

  const handleDelete = () => {
    if (!selectedBlog) return;
    dispatch(deleteBlog({ id: selectedBlog._id, token: Auth.token! }))
      .unwrap()
      .then(() => {
        toast.success('Blog deleted successfully');
        setDeleteModalOpen(false);
      })
      .catch((err) => {
        toast.error('Failed to delete blog');
        console.error(err);
      });
  };
  return (
    <>
      {/* Hero Section */}
      <Hero />

      <div className="flex flex-col gap-8 px-4 py-12">
        {/* Search and Filter */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:space-y-0">
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
                className={`rounded-full px-4 py-1 text-sm font-medium ${
                  activeCategory === category
                    ? 'bg-primary text-white'
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
          {status === 'loading' ? (
            <Loading />
          ) : status === 'failed' ? (
            <div className="rounded-2xl border border-red-500 bg-red-100 p-12 text-center text-red-500">
              Error Loading Blogs
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
              handleDelete={handleDelete}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
