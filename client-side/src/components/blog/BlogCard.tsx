// BlogCard.tsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Edit,
  Trash2,
  ChevronRight,
  Heart,
  MessageCircle,
  Calendar,
} from 'lucide-react';
import { formatDate } from '../../utlils/formateDate';
import useAuth from '../../contexts/AuthProvider';
import { isUserBlog } from '../../utlils/isUserBlog';
import UserAvatar from '../common/UserAvatar';

interface BlogCardProps {
  blog: any;
  index: number;
  handleEditBlog: (id: string) => void;
  confirmDelete: (blog: any) => void;
}

const BlogCard = ({
  blog,
  index,
  handleEditBlog,
  confirmDelete,
}: BlogCardProps) => {
  const Auth = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
    >
      <div className="relative h-48 bg-gradient-to-r from-blue-100 to-purple-100">
        {blog.thumbnail && (
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="h-full w-full object-cover"
          />
        )}
        {blog.category && (
          <span className="absolute left-4 top-4 rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-white">
            {blog.category}
          </span>
        )}
      </div>

      <div className="flex flex-col justify-between gap-2 p-4">
        <h3 className="mb-2 text-xl font-bold text-gray-800 group-hover:text-primary">
          {blog.title}
        </h3>

        <div className="mb-3 flex items-center space-x-4 text-sm text-gray-500">
          <Link
            to={`/profile/${blog.user._id}`}
            className="flex items-center gap-2"
          >
            <div className="flex h-6 w-6 items-center overflow-hidden rounded-full">
              <UserAvatar user={blog.user} />
            </div>
            {blog.user?.name}
          </Link>
        </div>
        {/* Divider */}
        <div className="flex-1 border-t border-gray-300" />
        {/* Blog Stats */}

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
        <div className="flex items-center justify-between pt-2">
          <Link
            to={`/blogs/${blog._id}`}
            className="flex items-center font-medium text-primary transition-colors hover:text-tertiary"
          >
            Read More <ChevronRight size={16} className="ml-1" />
          </Link>

          {Auth.user && isUserBlog(blog, Auth.user) && (
            <div className="flex space-x-1">
              <button
                onClick={() => handleEditBlog(blog._id)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-primary"
                aria-label="Edit blog"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => confirmDelete(blog)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-red-500"
                aria-label="Delete blog"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard;
