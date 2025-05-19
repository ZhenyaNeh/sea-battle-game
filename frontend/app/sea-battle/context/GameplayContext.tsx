'use client';

import { useAuth } from '@/hooks/useAuth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type GameplayContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const GameplayContext = createContext<GameplayContextType>({
  socket: null,
  isConnected: false,
});

export const useGameplay = () => useContext(GameplayContext);

export const GameplayProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Устанавливаем флаг инициализации после монтирования
    setInitialized(true);
    return () => setInitialized(false);
  }, []);

  useEffect(() => {
    if (!initialized || !user?._id) return;

    console.log('Initializing socket connection...');

    const socketInstance = io(
      `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000'}/gameplay`,
      {
        path: '/socket.io',
        auth: { userId: user._id },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 20000,
        autoConnect: true,
      },
    );

    // Обработчики событий
    const onConnect = () => {
      console.log('Socket connected successfully');
      setIsConnected(true);
    };

    const onDisconnect = (reason: string) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
    };

    const onConnectError = (err: Error) => {
      console.error('Connection error:', err);
    };

    // Подписываемся на события
    socketInstance.on('connect', onConnect);
    socketInstance.on('disconnect', onDisconnect);
    socketInstance.on('connect_error', onConnectError);

    setSocket(socketInstance);

    return () => {
      console.log('Cleaning up socket connection...');
      // Отписываемся от всех событий
      socketInstance.off('connect', onConnect);
      socketInstance.off('disconnect', onDisconnect);
      socketInstance.off('connect_error', onConnectError);

      // Закрываем соединение только если оно установлено
      if (socketInstance.connected) {
        socketInstance.disconnect();
      }
    };
  }, [initialized, user?._id]); // Зависимости

  return (
    <GameplayContext.Provider value={{ socket, isConnected }}>
      {children}
    </GameplayContext.Provider>
  );
};
