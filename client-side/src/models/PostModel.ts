import type { Blog } from './BlogModel';

export interface Post {
  _id: string;
  blog: Blog;
  createdAt: string;
}
