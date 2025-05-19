import Button from './ui/Button';

interface DeleteConfirmationModalProps {
  title: string;
  setDeleteModalOpen: (open: boolean) => void;
  handleDeleteBlog: () => void;
}

export function DeleteConfirmationModal({
  title,
  setDeleteModalOpen,
  handleDeleteBlog,
}: DeleteConfirmationModalProps) {
  return (
    <>
      <div
        className="bg-opacity-50 fixed inset-0 z-40 bg-black/50"
        onClick={() => setDeleteModalOpen(false)}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <h3 className="mb-4 text-xl font-bold text-gray-800">Delete Blog</h3>
          <p className="mb-6 text-gray-600">
            Are you sure you want to delete "{title}"? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-3">
            <div>
              <Button
                label="Cancel"
                variant="outline"
                onClick={() => setDeleteModalOpen(false)}
              ></Button>
            </div>
            <div>
              <Button
                label="Delete"
                variant="danger"
                onClick={handleDeleteBlog}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
