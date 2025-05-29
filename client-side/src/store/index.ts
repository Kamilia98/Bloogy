import { configureStore } from '@reduxjs/toolkit';
import blogsReducer from './features/blogs/blogsSlice';
import userReducer from './features/user/userSlice';
import postsReducer from './features/posts/postsSlice';

export const store = configureStore({
  reducer: {
    blogs: blogsReducer,
    user: userReducer,
    posts: postsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
