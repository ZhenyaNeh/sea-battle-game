'use client';

import SocketApi from '@/api/socket-api';
import {
  disconnectSocket,
  setSocket,
} from '@/store/features/socket/socketSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';

const useConnectSocket = (url: string) => {
  const dispatch = useAppDispatch();
  const socket = useAppSelector((state: RootState) => state.socket.socket);

  useEffect(() => {
    if (!socket) {
      const newSocket = new SocketApi();
      newSocket.connect(url);
      dispatch(setSocket(newSocket));
    }

    return () => {
      if (socket) {
        dispatch(disconnectSocket());
      }
    };
  }, [socket, dispatch, url]);

  return socket;
};

export default useConnectSocket;
