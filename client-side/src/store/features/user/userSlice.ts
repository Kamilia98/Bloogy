import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../..';
import type { User } from '../../../models/UserModel';

interface UserState {
  data: any;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  data: null,
  status: 'idle',
  error: null,
};
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Async thunk to fetch user by ID
export const fetchUserById = createAsyncThunk(
  'user/fetchById',
  async (
    { userId, token }: { userId: string; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.get(`${BASE_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch user',
      );
    }
  },
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (
    {
      userId,
      updatedData,
      token,
    }: { userId: string; updatedData: Partial<User>; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.patch(`${BASE_URL}/users/${userId}`, updatedData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to update user',
      );
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.data = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;

export const selectUser = (state: RootState) => state.user.data;
export const selectUserStatus = (state: RootState) => state.user.status;
