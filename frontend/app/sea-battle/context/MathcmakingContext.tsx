'use client';

import { useAuth } from '@/hooks/useAuth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type MatchmakingContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const MatchmakingContext = createContext<MatchmakingContextType>({
  socket: null,
  isConnected: false,
});

export const useMatchmaking = () => useContext(MatchmakingContext);

export const MatchmakingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?._id) return;
    console.log('Initializing socket connection...');

    const socketInstance = io(
      `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000'}/matchmaking`,
      {
        path: '/socket.io',
        auth: {
          // token: this.token,
          userId: user?._id,
        },
        transports: ['websocket'],
        reconnection: true,
      },
    );

    socketInstance.on('connect_error', (err) => {
      console.error('Connection error:', err);
      // toast.error(`Connection failed: ${err.message}`);
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('Socket connected successfully matchmaking');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected successfully matchmaking');
      setIsConnected(false);
    });

    // socketInstance.connect();

    return () => {
      socketInstance.disconnect();
    };
  }, [user?._id]);

  return (
    <MatchmakingContext.Provider value={{ socket, isConnected }}>
      {children}
    </MatchmakingContext.Provider>
  );
};
