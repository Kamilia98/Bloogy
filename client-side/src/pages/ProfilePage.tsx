import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../contexts/AuthProvider';
import Button from '../components/ui/Button';
import UserAvatar from '../components/UserAvatar';
import ProfileEditModal from '../components/ProfileEditModal';
import axios from 'axios';
import BlogCard from '../components/BlogCard';
import type { Blog } from '../models/BlogModel';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';

export default function ProfilePage() {
  const { id } = useParams();
  const Auth = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [userBlogs, setUserBlogs] = useState<any>(null);
  const [profileEditOpen, setProfileEditOpen] = useState(false);

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
        console.log('userData', userData);
        setUser(userData);
        isOwnProfile && Auth.setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    const fetchUserBlogs = async (userId: string) => {
      try {
        const response = await axios.get(`/api/blogs/user/${userId}`, {
          headers: { Authorization: `Bearer ${Auth.token}` },
        });
        const userBlogs = await response.data;
        console.log('userBlogs', userBlogs);
        setUserBlogs(userBlogs);
        console.log('userBlogs', userBlogs);
      } catch (error) {
        console.error('Error fetching user blogs:', error);
      }
    };
    if (id) {
      fetchUser(id);
      fetchUserBlogs(id);
    }
  }, [id]);

  const handleEditBlog = (blogId: string) => {
    navigate(`/blogs/edit/${blogId}`);
  };

  const confirmDelete = (blog: any) => {
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
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 text-gray-800">
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

        {userBlogs && userBlogs.length > 0 ? (
          <div className="flex w-3xl flex-col gap-6">
            {userBlogs.map((blog: Blog, index: number) => (
              <BlogCard
                index={index}
                blog={blog}
                handleEditBlog={handleEditBlog}
                confirmDelete={confirmDelete}
              />
            ))}
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
                to="/create-blog"
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
