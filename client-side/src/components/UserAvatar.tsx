import { useState } from 'react';
import type { User } from '../models/UserModel';

export default function UserAvatar({ user }: { user: User }) {
  const [imageError, setImageError] = useState(false);

  return user.avatar && !imageError ? (
    <img
      src={user.avatar}
      alt={user.name}
      className="h-8 w-8 rounded-full object-cover"
      onError={() => setImageError(true)}
    />
  ) : (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
      {user.name.charAt(0).toUpperCase()}
    </div>
  );
}
