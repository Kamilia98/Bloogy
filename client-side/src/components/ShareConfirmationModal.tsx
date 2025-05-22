import axios from 'axios';
import { Modal } from './common/Modal';
import toast from 'react-hot-toast';
import useAuth from '../contexts/AuthProvider';
import Button from './ui/Button';
import type { Blog } from '../models/BlogModel';

export default function ShareConfirmationModal({
  setShareModalOpen,
  selectedBlog,
}: {
  setShareModalOpen: (open: boolean) => void;
  selectedBlog: Blog;
}) {
  const Auth = useAuth();
  const handleShare = async () => {
    if (!selectedBlog) return;
    try {
      await axios.post(
        `/api/blogs/share/${selectedBlog._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Auth.token}`,
          },
        },
      );
      toast.success('Blog shared successfully');
      setShareModalOpen(false);
    } catch (error) {
      console.error('Error sharing blog:', error);
      toast.error('Failed to share blog');
    }
  };
  return (
    <Modal setModalOpen={setShareModalOpen}>
      <h3 className="mb-2 text-xl font-bold text-gray-800">Share Blog</h3>
      <p className="text-gray-600">
        Are you sure you want to share "{selectedBlog?.title}"?
      </p>
      <div className="flex justify-end gap-3">
        <div>
          <Button
            label="Cancel"
            variant="outline"
            onClick={() => setShareModalOpen(false)}
          />
        </div>
        <div>
          <Button label="Share" variant="secondary" onClick={handleShare} />
        </div>
      </div>
    </Modal>
  );
}
