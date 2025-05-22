import { useDispatch } from 'react-redux';

import Button from './ui/Button';
import useAuth from '../contexts/AuthProvider';
import toast from 'react-hot-toast';
import { deleteBlog } from '../store/features/blogs/blogsSlice';
import type { AppDispatch } from '../store';
import type { Blog } from '../models/BlogModel';
import { Modal } from './common/Modal';

interface DeleteConfirmationModalProps {
  setDeleteModalOpen: (open: boolean) => void;
  selectedBlog: Blog | null;
}

export function DeleteConfirmationModal({
  setDeleteModalOpen,
  selectedBlog,
}: DeleteConfirmationModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useAuth();

  const handleDelete = async () => {
    if (!selectedBlog || !token) return;

    try {
      await dispatch(deleteBlog({ id: selectedBlog._id, token })).unwrap();
      toast.success('Blog deleted successfully!');
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || err.message || 'Failed to delete blog',
      );
    } finally {
      setDeleteModalOpen(false);
    }
  };

  return (
    <>
      <Modal setModalOpen={setDeleteModalOpen}>
        <h3 className="mb-2 text-xl font-bold text-gray-800">Delete Blog</h3>
        <p className="text-gray-600">
          Are you sure you want to delete "{selectedBlog?.title}"? This action
          cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <div>
            <Button
              label="Cancel"
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
            />
          </div>
          <div>
            <Button label="Delete" variant="danger" onClick={handleDelete} />
          </div>
        </div>
      </Modal>
    </>
  );
}
