// External Libraries
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// Icons
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

import type { AppDispatch, RootState } from '../store';
import { fetchBlogById } from '../store/features/blogs/blogsSlice';

import useAuth from '../contexts/AuthProvider';

import BackButton from '../components/common/BackButton';
import BlogComponent from '../components/Blog';
import BlogCard from '../components/BlogCard';
import Loading from '../components/common/Loading';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';
import Button from '../components/ui/Button';
import { isUserBlog } from '../utlils/isUserBlog';
import BlogActions from '../components/BlogActions';
import { AnimatePresence } from 'framer-motion';

export default function BlogDetailsPage() {
  const { id: blogId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const Auth = useAuth();

  const {
    items: blogs,
    status,
    error,
  } = useSelector((state: RootState) => state.blogs);
  const blog = blogs.find((b) => b._id === blogId);
  const relatedBlogs = blogs
    .filter((b) => b.category === blog?.category && b._id !== blogId)
    .slice(0, 3);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRelatedBlog, setSelectedRelatedBlog] = useState(null);

  // Fetch blog data on load or when blogId changes
  useEffect(() => {
    if (blogId) {
      dispatch(fetchBlogById(blogId));
    }
  }, [dispatch, blogId]);

  const handleEditBlog = (blogId: string) => {
    navigate(`/blogs/edit/${blogId}`);
  };

  const confirmDelete = (blog: any) => {
    setSelectedRelatedBlog(blog);
    setDeleteModalOpen(true);
  };
  if (status === 'loading') return <Loading />;

  if (status === 'failed' || !blog) {
    return (
      <div className="container mx-auto flex h-screen items-center justify-center px-4">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-800">
            Blog Not Found
          </h2>
          <p className="mb-6 text-gray-600">
            {error || "We couldn't find the blog you're looking for."}
          </p>
          <Link
            to="/blogs"
            className="inline-flex items-center rounded-lg bg-[#4364F7] px-4 py-2 text-white hover:bg-[#3050d8]"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="container mx-auto mt-16 px-4">
        <div className="mx-auto flex max-w-4xl flex-col gap-8">
          <BackButton />
          {Auth.user && isUserBlog(blog, Auth.user) && (
            <div className="flex justify-end">
              <div>
                <Link
                  to={`/blogs/edit/${blog._id}`}
                  className="btn btn-secondary"
                >
                  <Edit size={16} className="mr-2" />
                  Edit Blog
                </Link>
              </div>
              <div>
                <Button
                  label="Delete Blog"
                  icon={<Trash2 size={16} />}
                  variant="danger"
                  className="ml-4"
                  onClick={() => confirmDelete(blog)}
                />
              </div>
            </div>
          )}
          <BlogComponent {...blog} />

          {Auth.isLoggedIn && Auth.user && !isUserBlog(blog, Auth.user) && (
            <BlogActions blog={blog} />
          )}

          {relatedBlogs.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Related Articles
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedBlogs.map((relatedBlog, index) => (
                  <BlogCard
                    key={relatedBlog._id || index}
                    index={index}
                    blog={relatedBlog}
                    handleEditBlog={handleEditBlog}
                    confirmDelete={confirmDelete}
                  />
                ))}
              </div>
            </div>
          )}
          <AnimatePresence>
            {deleteModalOpen && (
              <DeleteConfirmationModal
                setDeleteModalOpen={setDeleteModalOpen}
                selectedBlog={selectedRelatedBlog}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
