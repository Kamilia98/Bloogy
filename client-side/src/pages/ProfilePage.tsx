import { useState, useEffect } from 'react';
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
import useAuth from '../contexts/AuthProvider';
import Button from '../components/ui/Button';
import UserAvatar from '../components/UserAvatar';
import ProfileEditModal from '../components/ProfileEditModal';
import axios from 'axios';
import type { Blog } from '../models/BlogModel';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';
import { isUserBlog } from '../utlils/isUserBlog';
import { formatDate } from '../utlils/formateDate';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { fetchUserBlogs } from '../store/features/blogs/blogsSlice';

export default function ProfilePage() {
  const { id } = useParams();
  const Auth = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const userBlogs = useSelector((state: RootState) => state.blogs.items);

  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  useEffect(() => {
    const fetchUser = async (userId: string) => {
      try {
        const response = await axios.get(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${Auth.token}` },
        });
        const userData = await response.data;
        setUser(userData);
        isOwnProfile && Auth.setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    if (id && Auth.token) {
      fetchUser(id);
      dispatch(fetchUserBlogs({ userId: id, token: Auth.token }));
    }
  }, [id]);

  const handleEditBlog = (blogId: string) => {
    navigate(`/blogs/edit/${blogId}`);
  };

  const confirmDelete = (blog: Blog) => {
    setSelectedBlog(blog);
    setDeleteModalOpen(true);
  };

  // Check if viewing own profile
  const isOwnProfile = !id || (Auth.user && id === Auth.user._id);

  return (
    <div className="mt-8 flex flex-col gap-8 px-4 py-12">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center gap-4 rounded-xl bg-gray-200 p-8 text-gray-800"
      >
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-white/20 text-gray-800">
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

      {/* User Blogs */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col gap-6 rounded-xl p-8 text-gray-800"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {isOwnProfile ? 'My Blogs' : `${user?.name || 'User'}'s Blogs`}
          </h2>
        </div>

        {userBlogs ? (
          <div className="flex flex-col items-center gap-6">
            <div className="flex w-1/2 flex-col gap-4">
              {userBlogs.map((blog: Blog) => (
                <div
                  key={blog._id}
                  className="flex flex-col gap-4 rounded-2xl border border-gray-200 p-4"
                >
                  <div className="flex justify-between">
                    <Link
                      to={`/profile/${blog.user._id}`}
                      className="flex items-center gap-2"
                    >
                      <div className="flex h-6 w-6 items-center overflow-hidden rounded-full">
                        <UserAvatar user={blog.user} />
                      </div>
                      {blog.user?.name}
                    </Link>

                    <div className="flex space-x-1">
                      {isUserBlog(blog, Auth.user!) && (
                        <button
                          onClick={() => handleEditBlog(blog._id)}
                          className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-[#4364F7]"
                          aria-label="Edit blog"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => confirmDelete(blog)}
                        className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-red-500"
                        aria-label="Delete blog"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 border-t border-gray-300" />
                  <div className="flex flex-col gap-4">
                    <img
                      className="h-48 w-full object-cover"
                      src={blog.thumbnail}
                      alt=""
                    />
                    <h3 className="mb-2 text-xl font-bold text-gray-800 group-hover:text-[#4364F7]">
                      {blog.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Heart size={12} className="text-red-500" />
                          {blog.likes?.length || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle size={12} className="text-blue-500" />
                          {blog.comments?.length || 0}
                        </span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(blog.createdAt)}
                      </span>
                    </div>

                    <Link
                      to={`/blogs/${blog._id}`}
                      className="flex items-center font-medium text-[#4364F7] transition-colors hover:text-[#42d9fc]"
                    >
                      Read More <ChevronRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
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
        )}
      </motion.div>

      {/* Profile Edit Modal */}
      <AnimatePresence>
        {profileEditOpen && Auth.user && (
          <ProfileEditModal
            setProfileModalOpen={setProfileEditOpen}
            user={user}
            onUpdate={(updatedUser) => {
              setUser(updatedUser);
            }}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && (
          <DeleteConfirmationModal
            setDeleteModalOpen={setDeleteModalOpen}
            selectedBlog={selectedBlog}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
