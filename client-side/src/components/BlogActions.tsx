import useAuth from '../contexts/AuthProvider';
import type { Blog } from '../models/BlogModel';
import { Heart, MessageSquare, Send, Share2, Users } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import CommentComponent from './CommentComponent';
import UserAvatar from './UserAvatar';
import { Link } from 'react-router-dom';
import type { Comment } from '../models/CommentModel';
import ShareConfirmationModal from './ShareConfirmationModal';
export default function BlogActions({
  blog,
  commentText,
  setCommentText,
  handleLike,
  handleCommentSubmit,
  handleCommentEdit,
  handleCommentDelete,
}: {
  blog: Blog;
  commentText: string;
  setCommentText: (value: string) => void;
  handleLike: () => void;
  handleCommentSubmit: (commentText: string) => void;
  handleCommentEdit: (commentId: string, newText: string) => void;
  handleCommentDelete: (commentId: string) => void;
}) {
  const Auth = useAuth();

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentOpen, setCommentOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [likedUsersOpen, setLikedUsersOpen] = useState(false);

  useEffect(() => {
    if (blog && Auth.user?._id) {
      const userLiked = blog.likes.some((like) => like._id === Auth.user?._id);
      setLiked(userLiked);
      setLikeCount(blog.likes.length);
      setComments(blog.comments || []);
    }
  }, [blog, Auth.user]);

  return (
    <div className="flex flex-col gap-4 border-t border-gray-200 pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={handleLike}
            className="flex items-center focus:outline-none"
          >
            <Heart
              size={20}
              className={`mr-1 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
            />
            <span className="text-sm text-gray-600">{likeCount}</span>
          </button>
          {likeCount > 0 && (
            <button
              onClick={() => setLikedUsersOpen(true)}
              className="flex items-center focus:outline-none"
            >
              <Users size={20} className="mr-1 text-gray-500" />
              <span className="text-sm text-gray-600">Who liked</span>
            </button>
          )}
          <button
            onClick={() => setCommentOpen(!commentOpen)}
            className="flex items-center focus:outline-none"
          >
            <MessageSquare size={20} className="mr-1 text-gray-500" />
            <span className="text-sm text-gray-600">{comments.length}</span>
          </button>

          <button
            onClick={() => setShareOpen(!shareOpen)}
            className="flex items-center focus:outline-none"
          >
            <Share2 size={20} className="mr-1 text-gray-500" />
            <span className="text-sm text-gray-600">Share</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {likedUsersOpen && (
          <motion.div
            transition={{ duration: 0.3 }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-lg border border-gray-200 p-4"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Users who liked this blog
                </h3>
                <button
                  onClick={() => setLikedUsersOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>

              {blog.likes.length === 0 ? (
                <p className="text-gray-500">No likes yet.</p>
              ) : (
                <div className="max-h-64 overflow-y-auto">
                  {blog.likes.map((user) => (
                    <Link
                      to={`/profile/${user._id}`}
                      key={user._id}
                      className="flex items-center gap-2 py-2"
                    >
                      <div className="flex h-8 w-8 items-center overflow-hidden rounded-full">
                        <UserAvatar user={user} />
                      </div>
                      <span className="text-sm font-medium">{user.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {commentOpen && (
          <motion.div
            transition={{ duration: 0.3 }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-lg border border-gray-200 p-4"
          >
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold">
                Comments ({comments.length})
              </h3>
              <div className="flex">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) =>
                    setCommentText((e.target as HTMLInputElement).value)
                  }
                  placeholder="Add a comment..."
                  className="flex-1 rounded-l-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCommentSubmit((e.target as HTMLInputElement).value);
                      e.preventDefault();
                    }
                  }}
                />
                <button
                  onClick={() => handleCommentSubmit(commentText)}
                  className="rounded-r-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  <Send size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {comments.length === 0 ? (
                  <p className="text-gray-500">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <CommentComponent
                      key={comment._id}
                      comment={comment}
                      onDelete={handleCommentDelete}
                      onUpdate={handleCommentEdit}
                    />
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}

        {shareOpen && (
          <ShareConfirmationModal
            setShareModalOpen={setShareOpen}
            selectedBlog={blog}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
