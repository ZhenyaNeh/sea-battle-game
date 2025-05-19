'use client';

import { AcceptInviteDialog } from '@/components/dialog/AcceptInviteDilog';
import { useAuth } from '@/hooks/useAuth';
import { UserService } from '@/lib/service/user.service';
import { FriendShipData, FriendsInfo } from '@/lib/types/friendTypes';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

type GlobalReqContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const GlobalReqContext = createContext<GlobalReqContextType>({
  socket: null,
  isConnected: false,
});

export const useGlobalReq = () => useContext(GlobalReqContext);

export const GlobalReqProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();
  const [openInviteDilog, setOpenInviteDilog] = useState<boolean>(false);
  const [roomIdentify, setRoomIdentify] = useState<{
    gameId: string;
    invitationId: string;
  }>({ gameId: '', invitationId: '' });
  const [inviteUserInfo, setInviteUserInfo] = useState<FriendsInfo | null>(
    null,
  );

  useEffect(() => {
    // Устанавливаем флаг инициализации после монтирования
    setInitialized(true);
    return () => setInitialized(false);
  }, []);

  useEffect(() => {
    if (!initialized || !user?._id) return;

    console.log('Initializing socket connection...');
    const currentDateString = formatCurrentDate();

    const socketInstance = io(
      `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000'}/globalrequest`,
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
      console.log('Socket connected successfully global');
      setIsConnected(true);
    };

    const onDisconnect = (reason: string) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
    };

    const onConnectError = (err: Error) => {
      console.error('Connection error:', err);
    };

    const onFriendRequest = (friend: FriendShipData) => {
      if (friend && friend.status === 'pending') {
        toast.info('You have received a friend request', {
          description: currentDateString,
          action: {
            label: 'Show',
            onClick: () => router.push('/friends?param=request'),
          },
        });
      }
    };

    const onFriendAccept = (friend: FriendShipData) => {
      if (friend && friend.status === 'accepted') {
        toast.info('Your application has been accepted', {
          description: currentDateString,
        });
      }
    };

    const onFriendReject = (friend: FriendShipData) => {
      if (friend && friend.status === 'rejected') {
        toast.info('Your application has been rejected', {
          description: currentDateString,
        });
      }
    };

    const onFriendInvite = async (result: {
      invitationId: string;
      fromUserId: string;
      gameId: string;
    }) => {
      const data = await UserService.getInviteUserInfo(result.fromUserId);
      setInviteUserInfo(data);
      setOpenInviteDilog(true);
      setRoomIdentify({
        gameId: result.gameId,
        invitationId: result.invitationId,
      });
    };

    const onInviteDeclined = () => {
      toast.info('Your invitation has been declined.', {
        description: currentDateString,
      });
    };

    const onInviteMatchFound = (result: { roomId: string }) => {
      toast.info('Your invitation has been accepted.', {
        description: currentDateString,
      });
      router.push(`/sea-battle?private-room=${result.roomId}`);
    };

    // Подписываемся на события
    socketInstance.on('connect', onConnect);
    socketInstance.on('disconnect', onDisconnect);
    socketInstance.on('connect_error', onConnectError);
    socketInstance.on('friend_request', onFriendRequest);
    socketInstance.on('friend_accept', onFriendAccept);
    socketInstance.on('friend_reject', onFriendReject);
    socketInstance.on('friend_invite', onFriendInvite);
    socketInstance.on('invite_declined', onInviteDeclined);
    socketInstance.on('invite_match_found', onInviteMatchFound);

    setSocket(socketInstance);

    return () => {
      console.log('Cleaning up socket connection...');
      // Отписываемся от всех событий
      socketInstance.off('connect', onConnect);
      socketInstance.off('disconnect', onDisconnect);
      socketInstance.off('connect_error', onConnectError);
      socketInstance.off('friend_request', onFriendRequest);
      socketInstance.off('friend_accept', onFriendAccept);
      socketInstance.off('friend_reject', onFriendReject);
      socketInstance.off('friend_invite', onFriendInvite);
      socketInstance.off('invite_declined', onInviteDeclined);
      socketInstance.off('invite_match_found', onInviteMatchFound);

      // Закрываем соединение только если оно установлено
      if (socketInstance.connected) {
        socketInstance.disconnect();
      }
    };
  }, [initialized, router, user?._id]); // Зависимости

  function formatCurrentDate() {
    const date = new Date();

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(
      date,
    );

    // Добавляем "at" между датой и временем
    return formattedDate.replace(',', ' at');
  }

  return (
    <GlobalReqContext.Provider value={{ socket, isConnected }}>
      <AcceptInviteDialog
        openInviteDialog={openInviteDilog}
        setOpenInviteDialog={setOpenInviteDilog}
        inviteUserInfo={inviteUserInfo}
        roomIdentify={roomIdentify}
      />
      {children}
    </GlobalReqContext.Provider>
  );
};
