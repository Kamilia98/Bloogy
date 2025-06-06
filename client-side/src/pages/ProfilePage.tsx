import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  ChevronRight,
  Edit,
  Edit2,
  Heart,
  MessageCircle,
  Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';

import useAuth from '../contexts/AuthProvider';
import Button from '../components/ui/Button';
import UserAvatar from '../components/common/UserAvatar';
import ProfileEditModal from '../components/modal/ProfileEditModal';
import { DeleteConfirmationModal } from '../components/modal/DeleteConfirmationModal';
import Loading from '../components/common/Loading';

import { isUserBlog } from '../utlils/isUserBlog';
import { formatDate } from '../utlils/formateDate';
import { fetchUserById } from '../store/features/user/userSlice';
import type { RootState, AppDispatch } from '../store';
import {
  deleteShare,
  fetchUserPosts,
} from '../store/features/posts/postsSlice';
import { deleteBlog } from '../store/features/blogs/blogsSlice';
import type { Post } from '../models/PostModel';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { id } = useParams();
  const Auth = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Selectors
  const user = useSelector((state: RootState) => state.user.data);
  const status = useSelector((state: RootState) => state.posts.status);
  const posts = useSelector((state: RootState) => state.posts.items);

  // Local State
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Derived
  const isOwnProfile = useMemo(
    () => !id || (Auth.user && id === Auth.user._id),
    [id, Auth.user],
  );

  // Fetch profile data
  useEffect(() => {
    if (id) {
      dispatch(fetchUserById({ userId: id }));
      dispatch(fetchUserPosts({ userId: id }));
    }
  }, [id, dispatch]);

  const handleEditBlog = (blogId: string) => navigate(`/blogs/edit/${blogId}`);
  const confirmDelete = (post: Post) => {
    setSelectedPost(post);
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (!selectedPost) {
      toast.error('No post selected');
      return;
    }

    if (selectedPost.blog && isUserBlog(selectedPost.blog, user)) {
      dispatch(deleteBlog({ id: selectedPost.blog._id }))
        .unwrap()
        .then(() => {
          toast.success('Blog deleted successfully');
          setDeleteModalOpen(false);
        })
        .catch((err) => {
          toast.error('Failed to delete blog');
          console.error(err);
        });
    } else if (selectedPost._id) {
      dispatch(deleteShare({ id: selectedPost._id }))
        .unwrap()
        .then(() => {
          toast.success('Post deleted successfully');
          setDeleteModalOpen(false);
        })
        .catch((err) => {
          toast.error('Failed to delete post');
          console.error(err);
        });
    } else {
      toast.error('Invalid post data');
    }
  };

  const renderPosts = () => {
    if (status === 'loading') return <Loading />;

    if (!posts?.length) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <div className="mb-4 rounded-full bg-gray-100 p-6">
            <Edit2 size={32} className="text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-700">
            {isOwnProfile ? 'No blogs yet' : 'No blogs found'}
          </h3>
          <p className="max-w-md text-gray-500">
            {isOwnProfile
              ? 'Start sharing your thoughts and ideas by creating your first blog post.'
              : `${user?.name || 'This user'} hasn't published any blogs yet.`}
          </p>
          {isOwnProfile && (
            <Link
              to="/blogs/add"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <Edit2 size={16} />
              Create Your First Blog
            </Link>
          )}
        </motion.div>
      );
    }

    return (
      <div className="flex w-full flex-col items-center gap-6">
        <div className="grid w-full gap-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md"
            >
              <div className="flex flex-col md:flex-row">
                <img
                  src={post.blog.thumbnail}
                  alt={post.blog.title}
                  className="h-32 w-32 object-cover"
                />
                <div className="flex-1 p-4 md:p-6">
                  <div className="flex items-start justify-between">
                    <h4 className="line-clamp-2 font-semibold text-gray-900">
                      {post.blog.title}
                    </h4>
                    {isOwnProfile && (
                      <div className="ml-4 flex space-x-1">
                        {isUserBlog(post.blog, Auth.user!) && (
                          <button
                            onClick={() => handleEditBlog(post.blog._id)}
                            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                            aria-label="Edit blog"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => confirmDelete(post)}
                          className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-red-500"
                          aria-label="Delete blog"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mb-3 flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Heart size={14} className="mr-1 text-red-500" />
                      {post.blog.likes?.length || 0}
                    </span>
                    <span className="flex items-center">
                      <MessageCircle size={14} className="mr-1 text-blue-500" />
                      {post.blog.comments?.length || 0}
                    </span>
                    <span className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {formatDate(post.createdAt)}
                    </span>
                  </div>

                  <Link
                    to={`/blogs/${post.blog._id}`}
                    className="flex items-center text-sm font-medium text-[#4364F7] hover:text-[#3451E6]"
                  >
                    Read More <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-8 flex flex-col gap-8 px-4 py-12">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center gap-4 rounded-xl bg-gray-200 p-8 text-gray-800"
      >
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-white/20">
          {user && <UserAvatar user={user} />}
        </div>
        <h1 className="text-3xl font-bold">
          {isOwnProfile ? user?.name || Auth.user?.name : user?.name}
        </h1>
        <p className="text-lg opacity-90">
          {isOwnProfile ? user?.email || Auth.user?.email : user?.email}
        </p>
        {isOwnProfile && (
          <div>
            <Button
              onClick={() => setProfileEditOpen(true)}
              label="Edit Profile"
              icon={<Edit2 size={16} />}
              variant="outline"
            />
          </div>
        )}
      </motion.div>

      {/* Blog Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="rounded-xl p-8"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {isOwnProfile ? 'My Posts' : `${user?.name || 'User'}'s Posts`}
          </h2>
        </div>
        {renderPosts()}
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {profileEditOpen && Auth.user && (
          <ProfileEditModal
            setProfileModalOpen={setProfileEditOpen}
            user={user}
          />
        )}
        {deleteModalOpen && (
          <DeleteConfirmationModal
            title={selectedPost?.blog.title ?? ''}
            setDeleteModalOpen={setDeleteModalOpen}
            handleDelete={handleDelete}
            isUserBlog={
              selectedPost?.blog
                ? isUserBlog(selectedPost.blog, Auth.user!)
                : false
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
}
