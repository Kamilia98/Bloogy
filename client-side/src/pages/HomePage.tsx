import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../contexts/AuthProvider';
import Hero from '../components/Hero';
import { CATEGORY, type Blog } from '../models/BlogModel';
import { useDispatch, useSelector } from 'react-redux';
import { deleteBlog, fetchBlogs } from '../store/features/blogs/blogsSlice';
import BlogCard from '../components/BlogCard';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';
import type { AppDispatch, RootState } from '../store';
import Loading from '../components/common/Loading';
import toast from 'react-hot-toast';

import { Box, Chip, Typography, Stack } from '@mui/material';
import { Grid } from '@mui/material';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function BlogsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const Auth = useAuth();

  const blogs = useSelector((state: RootState) => state.blogs.items);
  const status = useSelector((state: RootState) => state.blogs.status);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<CATEGORY | 'all'>('all');

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  const blogsCategories: string[] = Object.keys(CATEGORY);
  const categories = ['all', ...blogsCategories];

  useEffect(() => {
    const params: Record<string, any> = {};
    if (searchTerm) params.search = searchTerm;
    if (activeCategory !== 'all') params.category = activeCategory;
    dispatch(fetchBlogs(params));
  }, [searchTerm, activeCategory, dispatch]);

  const handleCreateBlog = () => navigate('/blogs/add');
  const handleEditBlog = (blogId: string) => navigate(`/blogs/edit/${blogId}`);
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

      {/* Intro Text */}
      <Box
        sx={{
          py: 8,
          px: 2,
          background: 'linear-gradient(to bottom, #EFF6FF, #FFFFFF)',
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            color="text.primary"
            gutterBottom
          >
            Our Blogs
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            maxWidth="600px"
            mx="auto"
          >
            Explore the latest insights, tutorials, and updates from our
            creators
          </Typography>
        </motion.div>
      </Box>

      <Stack gap={5} px={4} pb={10} sx={{ backgroundColor: 'white' }}>
        {/* Search & Filter */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ md: 'center' }}
        >
          {/* Search Input */}
          <Box sx={{ width: { xs: '100%', md: 400 } }}>
            <Input
              placeholder="Search Blogs..."
              value={searchTerm}
              leftIcon={<Search size={16} />}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>

          {/* Category Filter */}
          <Stack direction={'row'} flexWrap={'wrap'} gap={2}>
            {categories.map((category) => (
              <Chip
                key={category}
                label={category.charAt(0).toUpperCase() + category.slice(1)}
                onClick={() => setActiveCategory(category as CATEGORY | 'all')}
                color={activeCategory === category ? 'primary' : 'default'}
                clickable
              />
            ))}
          </Stack>
        </Stack>

        {/* Create Blog Button */}
        {Auth.user && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <Box>
              <Button
                label="Create new Blog"
                onClick={handleCreateBlog}
                variant="primary"
                icon={<PlusCircle size={18} />}
              />
            </Box>
          </motion.div>
        )}

        {/* Blog List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {status === 'loading' ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Loading />
            </Box>
          ) : status === 'failed' ? (
            <Box
              sx={{
                border: '1px solid red',
                bgcolor: '#fee2e2',
                color: 'red',
                textAlign: 'center',
                borderRadius: 2,
                py: 4,
              }}
            >
              Error Loading Blogs
            </Box>
          ) : blogs.length === 0 ? (
            <Box textAlign="center" py={6} bgcolor="#F9FAFB" borderRadius={2}>
              <Typography variant="body1" color="text.secondary">
                {searchTerm || activeCategory !== 'all'
                  ? 'No blogs found matching your criteria.'
                  : 'No blogs found. Be the first to create one!'}
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={4} columns={{ xs: 1, md: 2, lg: 3 }}>
              <AnimatePresence>
                {blogs.map((blog, index) => (
                  <Grid size={1} key={blog._id || index}>
                    <BlogCard
                      index={index}
                      blog={blog}
                      handleEditBlog={handleEditBlog}
                      confirmDelete={confirmDelete}
                    />
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>
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
      </Stack>
    </>
  );
}
