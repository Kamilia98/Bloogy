import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { Blog } from '../models/BlogModel';
import BackButton from '../components/common/BackButton';
import BlogComponent from '../components/Blog';
import axios from 'axios';
import Loading from '../components/common/Loading';
import BlogCard from '../components/BlogCard';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';

export default function BlogDetailsPage() {
  const { id: blogId } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [selectedrelatedBlog, setSelectedRelatedBlog] = useState<Blog | null>(null);
  const navigate = useNavigate();

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/blogs/${blogId}`);
        const data = response.data;
        setBlog(data);
        fetchRelatedBlogs(data.category);
      } catch (error) {
        console.error('Error fetching blog:', error);
        setError('Failed to load blog');
      } finally {
        setIsLoading(false);
      }
    };

    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  // Fetch related blogs
  const fetchRelatedBlogs = async (category: string) => {
    try {
      // Replace with your actual API call
      const response = await fetch(`/api/blogs?category=${category}&limit=3`);
      const data = await response.json();
      // Filter out the current blog
      const filtered = data.filter((b: Blog) => b._id !== blogId);
      setRelatedBlogs(filtered.slice(0, 3));
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }
  };

  const handleEditBlog = (blogId: string) => {
    navigate(`/blogs/edit/${blogId}`);
  };

  const confirmDelete = (blog: Blog) => {
    setSelectedRelatedBlog(blog);
    setDeleteModalOpen(true);
  };

  if (isLoading) {
    return (
      <>
        <Loading />
      </>
    );
  }

  if (error || !blog) {
    return (
      <>
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
      </>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-b from-blue-50 to-white py-8">
        <div className="container mx-auto mt-16 px-4">
          <div className="mx-auto max-w-4xl">
            <BackButton />

            <BlogComponent {...blog} />

            {/* Related Blogs */}
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

            {deleteModalOpen && (
              <DeleteConfirmationModal
                setDeleteModalOpen={setDeleteModalOpen}
                selectedBlog={selectedrelatedBlog}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
