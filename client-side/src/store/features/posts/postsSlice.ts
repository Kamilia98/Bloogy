import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import axios from 'axios';
import type { Post } from '../../../models/PostModel';

interface PostsState {
  items: Post[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PostsState = {
  items: [],
  status: 'idle',
  error: null,
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
// === Async Thunks ===

// Fetch blogs by user
export const fetchUserPosts = createAsyncThunk(
  'blogs/fetchUserPosts',
  async ({ userId }: { userId: string }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/blogs/user/${userId}`);
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch user blogs',
      );
    }
  },
);

// Sharing
export const shareBlog = createAsyncThunk(
  'blogs/shareBlog',
  async ({ blogId }: { blogId: string }, { rejectWithValue }) => {
    try {
      await axios.post(
        `${BASE_URL}/blogs/share/${blogId}`,
        {},
        {
          withCredentials: true,
        },
      );
      return blogId;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to share blog',
      );
    }
  },
);

export const deleteShare = createAsyncThunk(
  'blogs/deleteShare',
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/blogs/share/${id}`, {
        withCredentials: true,
      });
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to delete share',
      );
    }
  },
);

// === Slice ===

const postsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchUserPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchUserPosts.fulfilled,
        (state, { payload }: PayloadAction<Post[]>) => {
          state.status = 'succeeded';
          state.items = payload;
        },
      )
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });

    const fulfilledHandlers: [any, (state: PostsState, action: any) => void][] =
      [
        [
          deleteShare.fulfilled,
          (state, { payload }) => {
            state.items = state.items.filter((b) => b._id !== payload);
          },
        ],
      ];

    for (const [caseFn, handler] of fulfilledHandlers) {
      builder.addCase(caseFn, handler);
    }
  },
});

export default postsSlice.reducer;
