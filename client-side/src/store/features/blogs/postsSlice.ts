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

// Utility to get auth headers
const authHeaders = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// === Async Thunks ===

// Fetch blogs by user
export const fetchUserPosts = createAsyncThunk(
  'blogs/fetchUserPosts',
  async (
    { userId, token }: { userId: string; token: string },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await axios.get(
        `/api/blogs/user/${userId}`,
        authHeaders(token),
      );
      console.log(data);
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
  async (
    { blogId, token }: { blogId: string; token: string },
    { rejectWithValue },
  ) => {
    try {
      await axios.post(`/api/blogs/share/${blogId}`, {}, authHeaders(token));
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
  async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/blogs/share/${id}`, authHeaders(token));
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
