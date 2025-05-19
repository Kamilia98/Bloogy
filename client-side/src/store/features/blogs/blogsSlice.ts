import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import axios from 'axios';
import type { Blog } from '../../../models/BlogModel';

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
      });
  },
});

export default blogsSlice.reducer;
