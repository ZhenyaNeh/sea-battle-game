import { configureStore } from '@reduxjs/toolkit';
import socketReducer from '@/store/features/socket/socketSlice';
import userReducer from '@/store/features/user/userSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      socket: socketReducer,
      user: userReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
