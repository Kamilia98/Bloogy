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

// Utility to get auth headers
const authHeaders = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// === Async Thunks ===

// Fetch all blogs
export const fetchBlogs = createAsyncThunk(
  'blogs/fetchBlogs',
  async (params: Record<string, any>, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/blogs`, { params });
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch blogs',
      );
    }
  },
);

// Fetch blog by ID
export const fetchBlogById = createAsyncThunk(
  'blogs/fetchBlogById',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/blogs/${id}`);
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch blog',
      );
    }
  },
);

// Add blog
export const addBlog = createAsyncThunk(
  'blogs/addBlog',
  async (
    {
      token,
      blog,
    }: {
      token: string;
      blog: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>;
    },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/blogs`,
        blog,
        authHeaders(token),
      );
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to add blog',
      );
    }
  },
);

// Update blog
export const updateBlog = createAsyncThunk(
  'blogs/updateBlog',
  async (
    { token, blog }: { token: string; blog: Blog },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await axios.patch(
        `/api/blogs/${blog._id}`,
        blog,
        authHeaders(token),
      );
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to update blog',
      );
    }
  },
);

// Delete blog
export const deleteBlog = createAsyncThunk(
  'blogs/deleteBlog',
  async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/blogs/${id}`, authHeaders(token));
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to delete blog',
      );
    }
  },
);

// Toggle like
export const toggleLikeBlog = createAsyncThunk(
  'blogs/toggleLikeBlog',
  async (
    {
      blogId,
      token,
      userId,
    }: { blogId: string; token: string; userId: string },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await axios.post(
        `/api/blogs/like/${blogId}`,
        {},
        authHeaders(token),
      );
      const isLiked = data.likes.some((like: User) => like._id === userId);
      return { blogId, likes: data.likes, isLiked };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to toggle like',
      );
    }
  },
);

// Comments
export const addComment = createAsyncThunk(
  'blogs/addComment',
  async (
    {
      blogId,
      content,
      token,
    }: { blogId: string; content: string; token: string },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await axios.post(
        `/api/comments/${blogId}`,
        { content },
        authHeaders(token),
      );
      return { blogId, comment: data };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to add comment',
      );
    }
  },
);

export const deleteComment = createAsyncThunk(
  'blogs/deleteComment',
  async (
    { commentId, token }: { commentId: string; token: string },
    { rejectWithValue },
  ) => {
    try {
      await axios.delete(`/api/comments/${commentId}`, authHeaders(token));
      return { commentId };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to delete comment',
      );
    }
  },
);

export const editComment = createAsyncThunk(
  'blogs/editComment',
  async (
    {
      commentId,
      content,
      token,
    }: { commentId: string; content: string; token: string },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await axios.patch(
        `/api/comments/${commentId}`,
        { content },
        authHeaders(token),
      );
      return { commentId, content: data.content };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to edit comment',
      );
    }
  },
);

// === Slice ===

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchBlogs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchBlogs.fulfilled,
        (state, { payload }: PayloadAction<Blog[]>) => {
          state.status = 'succeeded';
          state.items = payload;
        },
      )
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      .addCase(fetchBlogById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBlogById.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        const index = state.items.findIndex((b) => b._id === payload._id);
        index !== -1
          ? (state.items[index] = payload)
          : state.items.push(payload);
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });

    const fulfilledHandlers: [any, (state: BlogsState, action: any) => void][] =
      [
        [
          addBlog.fulfilled,
          (state, { payload }) => {
            state.items.push(payload);
          },
        ],
        [
          updateBlog.fulfilled,
          (state, { payload }) => {
            const i = state.items.findIndex((b) => b._id === payload._id);
            if (i !== -1) state.items[i] = payload;
          },
        ],
        [
          deleteBlog.fulfilled,
          (state, { payload }) => {
            state.items = state.items.filter((b) => b._id !== payload);
          },
        ],
        [
          toggleLikeBlog.fulfilled,
          (state, { payload }) => {
            const blog = state.items.find((b) => b._id === payload.blogId);
            if (blog) blog.likes = payload.likes;
          },
        ],
        [
          addComment.fulfilled,
          (state, { payload }) => {
            const blog = state.items.find((b) => b._id === payload.blogId);
            blog?.comments?.push(payload.comment);
          },
        ],
        [
          deleteComment.fulfilled,
          (state, { payload }) => {
            state.items.forEach((b) => {
              b.comments = b.comments?.filter(
                (c) => c._id !== payload.commentId,
              );
            });
          },
        ],
        [
          editComment.fulfilled,
          (state, { payload }) => {
            state.items.forEach((b) => {
              const c = b.comments?.find((x) => x._id === payload.commentId);
              if (c) c.content = payload.content;
            });
          },
        ],
      ];

    for (const [caseFn, handler] of fulfilledHandlers) {
      builder.addCase(caseFn, handler);
    }
  },
});

export default blogsSlice.reducer;
