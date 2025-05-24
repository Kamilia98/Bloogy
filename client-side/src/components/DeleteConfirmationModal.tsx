import Button from './ui/Button';
import { Modal } from './common/Modal';

interface DeleteConfirmationModalProps {
  title: string;
  setDeleteModalOpen: (open: boolean) => void;
  handleDelete: () => void;
  isUserBlog?: boolean;
}

export function DeleteConfirmationModal({
  title,
  setDeleteModalOpen,
  handleDelete,
  isUserBlog,
}: DeleteConfirmationModalProps) {
  return (
    <>
      <Modal setModalOpen={setDeleteModalOpen}>
        <Modal.Header>
          Delete {isUserBlog === false ? 'Share' : 'Blog'}
        </Modal.Header>
        <Modal.Content>
          <p className="text-gray-600">
            Are you sure you want to delete "{title}"? This action cannot be
            undone.
          </p>
        </Modal.Content>
        <Modal.Footer>
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
        </Modal.Footer>
      </Modal>
    </>
  );
}
