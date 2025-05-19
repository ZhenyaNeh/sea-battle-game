import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import SocketApi from '@/api/socket-api';

interface SocketState {
  socket: SocketApi | null;
}

const initialState: SocketState = {
  socket: null,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocket(state, action: PayloadAction<SocketApi>) {
      state.socket = action.payload;
    },
    disconnectSocket(state) {
      if (state.socket) {
        state.socket.disconnect();
        state.socket = null;
      }
    },
  },
});

export const { setSocket, disconnectSocket } = socketSlice.actions;
export default socketSlice.reducer;
