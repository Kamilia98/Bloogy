import { Modal } from './common/Modal';
import toast from 'react-hot-toast';
import useAuth from '../contexts/AuthProvider';
import Button from './ui/Button';
import type { Blog } from '../models/BlogModel';
import { useAppDispatch } from '../store/hooks';
import { shareBlog } from '../store/features/blogs/postsSlice';

export default function ShareConfirmationModal({
  setShareModalOpen,
  selectedBlog,
}: {
  setShareModalOpen: (open: boolean) => void;
  selectedBlog: Blog;
}) {
  const Auth = useAuth();
  const dispatch = useAppDispatch();
  const shareSound = new Audio('/sounds/share.mp3');
  const handleShare = async () => {
    if (!selectedBlog) return;

    await dispatch(shareBlog({ blogId: selectedBlog._id, token: Auth.token! }))
      .unwrap()
      .then(() => {
        shareSound.currentTime = 0;
        shareSound.play();
        toast.success('Blog shared successfully');
      })
      .catch((error) => {
        toast.error(error || 'Failed to share blog');
      })
      .finally(() => {
        setShareModalOpen(false);
      });
  };

  return (
    <Modal setModalOpen={setShareModalOpen}>
      <Modal.Header>Share Blog</Modal.Header>
      <Modal.Content>
        <p className="text-gray-600">
          Are you sure you want to share "{selectedBlog?.title}"?
        </p>
      </Modal.Content>
      <Modal.Footer>
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
      </Modal.Footer>
    </Modal>
  );
}
