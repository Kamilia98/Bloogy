import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import axios from 'axios';
import type { Blog } from '../../../models/BlogModel';
import type { User } from '../../../models/UserModel';

interface BlogsState {
  items: Blog[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BlogsState = {
  items: [],
  status: 'idle',
  error: null,
};

// Async thunks
export const fetchBlogs = createAsyncThunk(
  'blogs/fetchBlogs',
  async (params: Record<string, any>) => {
    const response = await axios.get('/api/blogs', { params });
    return response.data;
  },
);

export const fetchBlogById = createAsyncThunk(
  'blogs/fetchBlogById',
  async (id: string) => {
    const response = await axios.get(`/api/blogs/${id}`);
    return response.data;
  },
);

export const addBlog = createAsyncThunk(
  'blogs/addBlog',
  async ({
    token,
    blog,
  }: {
    token: string;
    blog: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>;
  }) => {
    const response = await axios.post('/api/blogs', blog, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  },
);

export const updateBlog = createAsyncThunk(
  'blogs/updateBlog',
  async ({ token, blog }: { token: string; blog: Blog }) => {
    const response = await axios.patch(`/api/blogs/${blog._id}`, blog, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
);

export const deleteBlog = createAsyncThunk(
  'blogs/deleteBlog',
  async ({ id, token }: { id: string; token: string }) => {
    console.log(id);
    await axios.delete(`/api/blogs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return id;
  },
);

// Like or unlike blog
export const toggleLikeBlog = createAsyncThunk(
  'blogs/toggleLikeBlog',
  async ({
    blogId,
    token,
    userId,
  }: {
    blogId: string;
    token: string;
    userId: string;
  }) => {
    const response = await axios.post(
      `/api/blogs/like/${blogId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    console.log(response.data);
    const updatedLikes = response.data.likes;
    const isLiked = updatedLikes.some((like: User) => like._id === userId);
    return { blogId, likes: updatedLikes, isLiked };
  },
);

// Add comment
export const addComment = createAsyncThunk(
  'blogs/addComment',
  async ({
    blogId,
    content,
    token,
  }: {
    blogId: string;
    content: string;
    token: string;
  }) => {
    const response = await axios.post(
      `/api/comments/${blogId}`,
      { content },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return { blogId, comment: response.data };
  },
);

// Delete comment
export const deleteComment = createAsyncThunk(
  'blogs/deleteComment',
  async ({ commentId, token }: { commentId: string; token: string }) => {
    await axios.delete(`/api/comments/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { commentId };
  },
);

// Edit comment
export const editComment = createAsyncThunk(
  'blogs/editComment',
  async ({
    commentId,
    content,
    token,
  }: {
    commentId: string;
    content: string;
    token: string;
  }) => {
    const response = await axios.patch(
      `/api/comments/${commentId}`,
      { content },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return { commentId, content: response.data.content };
  },
);

// Add at the top with other thunks
export const shareBlog = createAsyncThunk(
  'blogs/shareBlog',
  async (
    { blogId, token }: { blogId: string; token: string },
    { rejectWithValue },
  ) => {
    try {
      await axios.post(
        `/api/blogs/share/${blogId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return blogId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to share blog',
      );
    }
  },
);

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch blogs
      .addCase(fetchBlogs.pending, (state) => {
        state.status = 'loading';
      })

      .addCase(fetchBlogs.fulfilled, (state, action: PayloadAction<Blog[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch blogs';
      })

      // Fetch blog by ID
      .addCase(fetchBlogById.pending, (state) => {
        state.status = 'loading';
      })

      .addCase(
        fetchBlogById.fulfilled,
        (state, action: PayloadAction<Blog>) => {
          state.status = 'succeeded';
          const index = state.items.findIndex(
            (blog) => blog._id === action.payload._id,
          );
          if (index !== -1) {
            state.items[index] = action.payload;
          } else {
            state.items.push(action.payload);
          }
        },
      )

      // Add blog
      .addCase(addBlog.fulfilled, (state, action: PayloadAction<Blog>) => {
        state.items.push(action.payload);
      })

      // Update blog
      .addCase(updateBlog.fulfilled, (state, action: PayloadAction<Blog>) => {
        const index = state.items.findIndex(
          (blog) => blog._id === action.payload._id,
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      .addCase(deleteBlog.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((blog) => blog._id !== action.payload);
      })

      // Toggle Like
      .addCase(toggleLikeBlog.fulfilled, (state, action) => {
        const { blogId, likes } = action.payload;
        const blog = state.items.find((b) => b._id === blogId);
        if (blog) {
          blog.likes = likes;
        }
      })

      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        const { blogId, comment } = action.payload;
        const blog = state.items.find((b) => b._id === blogId);
        if (blog && Array.isArray(blog.comments)) {
          blog.comments.push(comment);
        }
      })

      // Delete Comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { commentId } = action.payload;
        state.items.forEach((blog) => {
          blog.comments = blog.comments?.filter((c) => c._id !== commentId);
        });
      })

      // Edit Comment
      .addCase(editComment.fulfilled, (state, action) => {
        const { commentId, content } = action.payload;
        state.items.forEach((blog) => {
          const comment = blog.comments?.find((c) => c._id === commentId);
          if (comment) comment.content = content;
        });
      });
  },
});

export default blogsSlice.reducer;
