import { useState } from 'react';
import type { User } from '../../models/UserModel';
import { Modal } from '../ui/Modal';
import Input from '../ui/Input';
import ImageUploader from '../common/ImageUploader';
import Button from '../ui/Button';
import { Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../../contexts/AuthProvider';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../store/features/user/userSlice';
import type { AppDispatch } from '../../store';

export default function ProfileEditModal({
  setProfileModalOpen,
  user,
}: {
  setProfileModalOpen: (open: boolean) => void;
  user: User;
  onUpdate?: (updatedUser: User) => void;
}) {
  const Auth = useAuth();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(user.avatar);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updatedData = { name, email, avatar };
      const resultAction = await dispatch(
        updateUser({ userId: user._id, updatedData }),
      );

      if (updateUser.fulfilled.match(resultAction)) {
        toast.success('Profile updated successfully!');
        Auth.onUserUpdate(resultAction.payload);
        setProfileModalOpen(false);
      } else {
        throw new Error(resultAction.payload as string);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal setModalOpen={setProfileModalOpen}>
      <Modal.Header>Edit Profile</Modal.Header>
      <Modal.Content className="flex flex-col gap-4">
        <Input
          label="Name"
          type="text"
          id="name"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Email"
          type="email"
          id="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Avatar
          </label>
          <ImageUploader
            initial={avatar}
            onUpload={(imageUrl) => setAvatar(imageUrl)}
          />
        </div>
      </Modal.Content>

      <Modal.Footer>
        <div>
          <Button
            label="Cancel"
            variant="outline"
            onClick={() => setProfileModalOpen(false)}
          />
        </div>
        <div>
          <Button
            label="Save"
            variant="secondary"
            onClick={handleSave}
            icon={
              isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )
            }
          />
        </div>
      </Modal.Footer>
    </Modal>
  );
}
