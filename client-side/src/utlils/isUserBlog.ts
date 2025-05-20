import type { Blog } from '../models/BlogModel';
import type { User } from '../models/UserModel';

export const isUserBlog = (blog: Blog, user: User) => {
  return user && blog.user._id === user._id;
};
