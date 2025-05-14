import { useEffect } from 'react';
import { useState } from 'react';

import type { Blog } from '../models/BlogModel';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const response = await fetch('/api/blogs');
      const data = await response.json();
      setBlogs(data);
    };
    fetchBlogs();
  }, []);
  return (
    <div>
      <h1>Blogs</h1>
    </div>
  );
}
