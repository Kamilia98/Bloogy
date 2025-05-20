import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Heart, MessageSquare, Send, Share2, X } from 'lucide-react';



import BackButton from '../components/common/BackButton';
import BlogComponent from '../components/Blog';
import BlogCard from '../components/BlogCard';
import Loading from '../components/common/Loading';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';
import type { AppDispatch, RootState } from '../store';
import { fetchBlogById, fetchBlogs } from '../store/features/blogs/blogsSlice';

export default function BlogDetailsPage() {
  const { id: blogId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRelatedBlog, setSelectedRelatedBlog] = useState(null);


  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentOpen, setCommentOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  type Comment = { id: number; text: string; author: string; createdAt: string };
  const [comments, setComments] = useState<Comment[]>([]);

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      const newComment = {
        id: Date.now(),
        text: commentText,
        author: 'You',
        createdAt: new Date().toISOString(),
      };
      setComments([...comments, newComment]);
      setCommentText('');
    }
  };

  const handleShare = (platform: string) => {
    // In a real app, you would implement actual sharing functionality
    console.log(`Sharing to ${platform}: ${window.location.href}`);
    setShareOpen(false);
  };

  const { items: blogs, status, error } = useSelector(
    (state: RootState) => state.blogs
  );

  const blog = blogs.find((b) => b._id === blogId);
  const relatedBlogs = blogs
    .filter((b) => b.category === blog?.category && b._id !== blogId)
    .slice(0, 3);

  useEffect(() => {
    if (blogId) {
      dispatch(fetchBlogById(blogId));
    }
  }, [dispatch, blogId]);

  useEffect(() => {
    if (blog?.category) {
      dispatch(fetchBlogs
        ({ category: blog.category, limit: 3 }));
    }
  }, [blog?.category]);

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
          <h2 className="mb-2 text-2xl font-bold text-gray-800">Blog Not Found</h2>
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
        <div className="mx-auto max-w-4xl flex flex-col gap-8">
          <BackButton />
          <BlogComponent {...blog} />


          {/* Social interaction bar */}
          <div className="flex flex-col gap-4 border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                {/* Like button */}
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

                {/* Comment button */}
                <button
                  onClick={() => setCommentOpen(!commentOpen)}
                  className="flex items-center focus:outline-none"
                >
                  <MessageSquare size={20} className="mr-1 text-gray-500" />
                  <span className="text-sm text-gray-600">{comments.length}</span>
                </button>

                {/* Share button */}
                <button
                  onClick={() => setShareOpen(!shareOpen)}
                  className="flex items-center focus:outline-none"
                >
                  <Share2 size={20} className="mr-1 text-gray-500" />
                  <span className="text-sm text-gray-600">Share</span>
                </button>
              </div>
            </div>

            {/* Comment section */}
            {commentOpen && (
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="flex flex-col gap-4">
                  <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>

                  {/* Comment input */}
                  <div className="flex">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 rounded-l-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleCommentSubmit();
                          e.preventDefault();
                        }
                      }}
                    />
                    <button
                      onClick={handleCommentSubmit}
                      className="rounded-r-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    >
                      <Send size={16} />
                    </button>
                  </div>

                  {/* Comments list */}
                  <div className="flex flex-col gap-4">
                    {comments.length === 0 ? (
                      <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment.id} className="rounded-lg bg-gray-50 p-3">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{comment.author}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{comment.text}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Share popup */}
            {shareOpen && (
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Share this article</h3>
                    <button onClick={() => setShareOpen(false)} className="text-gray-500 hover:text-gray-700">
                      <X size={18} />
                    </button>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => handleShare('twitter')}
                      className="flex items-center rounded-lg bg-blue-400 px-4 py-2 text-white hover:bg-blue-500"
                    >
                      Twitter
                    </button>
                    <button
                      onClick={() => handleShare('facebook')}
                      className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                      Facebook
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="flex items-center rounded-lg bg-blue-800 px-4 py-2 text-white hover:bg-blue-900"
                    >
                      LinkedIn
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Related Blogs */}
          {relatedBlogs.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">Related Articles</h2>
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

          {deleteModalOpen && (
            <DeleteConfirmationModal
              setDeleteModalOpen={setDeleteModalOpen}
              selectedBlog={selectedRelatedBlog}
            />
          )}
        </div>
      </div>
    </div>
  );
}
