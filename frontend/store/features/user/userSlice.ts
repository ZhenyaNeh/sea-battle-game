import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserInfo {
  _id: string;
  nickname: string;
  email: string;
  role: string;
  rating: number;
  avatarUrl: string;
  token: string;
}

interface UserState {
  user: UserInfo | null;
  isAuth: boolean;
}

const initialState: UserState = {
  user: null,
  isAuth: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // setSocket(state, action: PayloadAction<SocketApi>) {
    //   state.socket = action.payload;
    // },
    // disconnectSocket(state) {
    //   if (state.socket) {
    //     state.socket.disconnect();
    //     state.socket = null;
    //   }
    // },
    updateUser(state, action: PayloadAction<Partial<UserInfo>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    login(state, action: PayloadAction<UserInfo>) {
      state.user = action.payload;
      state.isAuth = true;
    },
    logout(state) {
      state.user = null;
      state.isAuth = false;
    },
  },
});

export const { login, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;
