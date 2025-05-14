import { useEffect } from 'react';
import { useState } from 'react';

import type { Blog } from '../models/BlogModel';
import axios from 'axios';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const response = await axios.get('http://localhost:3000/blogs');
      console.log(response.data);
      setBlogs(response.data);
    };
    fetchBlogs();
  }, []);
  return (
    <div>
      <h1>Blogs</h1>
    </div>
  );
}
