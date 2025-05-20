export interface Comment {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    avatar: string;
  };
  content: string;
  blog: string;
  createdAt: string;
}
