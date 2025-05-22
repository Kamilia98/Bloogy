import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../contexts/AuthProvider';
import type { Comment } from '../models/CommentModel';
import UserAvatar from './UserAvatar';
import { Edit, Trash2, Check, X } from 'lucide-react';

export default function CommentComponent({
  comment,
  onDelete,
  onUpdate,
}: {
  comment: Comment;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, content: string) => Promise<void>;
}) {
  const Auth = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditClick = () => {
    setEditContent(comment.content);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  const handleSaveEdit = async () => {
    if (editContent.trim() === '') return;

    try {
      await onUpdate(comment._id, editContent);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleting(true);
  };

  const confirmDelete = async () => {
    try {
      await onDelete(comment._id);
    } catch (error) {
      console.error('Failed to delete comment:', error);
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleting(false);
  };

  const isOwner = Auth.user?._id === comment.user._id;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-2">
        {/* Header: User Info & Actions */}
        <div className="flex items-start justify-between">
          {/* User Info */}
          <Link
            to={`/user/${comment.user._id}`}
            className="flex items-center gap-3 hover:underline"
          >
            <div className="h-8 w-8">
              <UserAvatar user={comment.user} />
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-900">
                {comment.user.name}
              </span>
              <div className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </div>
            </div>
          </Link>

          {/* Actions */}
          {isOwner && !isEditing && !isDeleting && (
            <div className="flex items-center gap-2">
              <button
                title="Edit"
                className="text-gray-500 hover:text-gray-700"
                onClick={handleEditClick}
              >
                <Edit size={16} />
              </button>
              <button
                title="Delete"
                className="text-gray-500 hover:text-gray-700"
                onClick={handleDeleteClick}
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}

          {/* Edit Mode Controls */}
          {isOwner && isEditing && (
            <div className="flex items-center gap-2">
              <button
                title="Save"
                className="text-green-500 hover:text-green-700"
                onClick={handleSaveEdit}
              >
                <Check size={16} />
              </button>
              <button
                title="Cancel"
                className="text-gray-500 hover:text-gray-700"
                onClick={handleCancelEdit}
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Delete Confirmation */}
        {isDeleting && (
          <div className="mt-2 flex flex-col gap-2">
            <p className="text-sm font-medium text-red-600">
              Are you sure you want to delete this comment?
            </p>
            <div className="flex gap-2">
              <button
                onClick={confirmDelete}
                className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className="rounded bg-gray-200 px-3 py-1 text-xs font-medium text-gray-800 hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Comment Content */}
        {!isEditing ? (
          <p className="text-sm leading-relaxed whitespace-pre-line text-gray-800">
            {comment.content}
          </p>
        ) : (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full rounded border border-gray-300 p-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows={3}
          />
        )}
      </div>
    </div>
  );
}
