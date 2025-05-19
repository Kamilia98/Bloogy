// BlogCard.tsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, User, Edit, Trash2, ChevronRight } from 'lucide-react';
import { formatDate } from '../utlils/formateDate';
import type { Blog } from '../models/BlogModel';
import useAuth from '../contexts/AuthProvider';

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
  // Check if a blog belongs to the current user
  const isUserBlog = (blog: Blog) => {
    console.log(Auth.user, blog.user);
    return Auth.user && blog.user._id === Auth.user._id;
  };

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
          <span className="absolute top-4 left-4 rounded-full bg-[#4364F7]/90 px-3 py-1 text-xs font-medium text-white">
            {blog.category}
          </span>
        )}
      </div>

      <div className="p-6">
        <h3 className="mb-2 text-xl font-bold text-gray-800 group-hover:text-[#4364F7]">
          {blog.title}
        </h3>

        <div className="mb-3 flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            {blog.createdAt ? formatDate(blog.createdAt) : 'No date'}
          </div>
          <div className="flex items-center">
            <User size={14} className="mr-1" />
            {blog.user.name}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Link
            to={`/blogs/${blog._id}`}
            className="flex items-center font-medium text-[#4364F7] transition-colors hover:text-[#42d9fc]"
          >
            Read More <ChevronRight size={16} className="ml-1" />
          </Link>

          {isUserBlog(blog) && (
            <div className="flex space-x-1">
              <button
                onClick={() => handleEditBlog(blog._id)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-[#4364F7]"
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
