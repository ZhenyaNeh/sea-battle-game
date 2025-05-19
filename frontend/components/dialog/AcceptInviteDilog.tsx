'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { FriendsInfo } from '@/lib/types/friendTypes';
// import { useSocket } from '@/hooks/useSocket';
// import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGlobalReq } from '@/app/sea-battle/context/GlobalRequestContext';
import { useState } from 'react';
import { UserService } from '@/lib/service/user.service';

interface AcceptInviteDialogProps {
  openInviteDialog: boolean;
  inviteUserInfo: FriendsInfo | null;
  roomIdentify: { gameId: string; invitationId: string };
  setOpenInviteDialog: React.Dispatch<React.SetStateAction<boolean>>;
  // onResponse?: (accepted: boolean) => void;
}

export function AcceptInviteDialog({
  openInviteDialog,
  setOpenInviteDialog,
  inviteUserInfo,
  roomIdentify,
  // onResponse,
}: AcceptInviteDialogProps) {
  const { socket } = useGlobalReq();
  const [isLoading, setIsLoading] = useState(false);

  const handleInviteResult = async (accepted: boolean) => {
    if (!socket || !roomIdentify.invitationId) return;

    setIsLoading(true);
    try {
      // Отправляем ответ на сервер через WebSocket
      if (accepted) {
        socket.emit('accept_invite', {
          invitationId: roomIdentify.invitationId,
        });
      } else {
        socket.emit('decline_invite', {
          invitationId: roomIdentify.invitationId,
        });
      }

      // if (onResponse) {
      //   onResponse(accepted);
      // }
    } catch (error) {
      console.error('Error responding to invite:', error);
    } finally {
      setIsLoading(false);
      setOpenInviteDialog(false);
    }
  };

  // Автоматическое отклонение при закрытии диалога
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleInviteResult(false); // Автоматически отклоняем при закрытии
    }
    setOpenInviteDialog(open);
  };

  return (
    <Dialog open={openInviteDialog} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {inviteUserInfo?.avatarUrl && (
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={
                    UserService.getProfilePhoto(
                      inviteUserInfo?.avatarUrl || '',
                    ) || 'U'
                  }
                />
                <AvatarFallback>
                  {inviteUserInfo?.nickname?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
            <div>
              <DialogTitle>Game Invite</DialogTitle>
              <DialogDescription>
                {inviteUserInfo?.nickname} invite you in game
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              User rating: {inviteUserInfo?.rating || 'Неизвестно'}
            </p>
            <p className="text-sm text-muted-foreground">
              Gamemode:{' '}
              {roomIdentify.gameId === 'sea-battle-classic'
                ? 'classic'
                : 'with event'}
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant={'default'}
              onClick={() => handleInviteResult(true)}
              disabled={isLoading}
            >
              Accept
            </Button>
            <Button
              variant={'outline'}
              // className="bg-muted"
              onClick={() => handleInviteResult(false)}
              disabled={isLoading}
            >
              Decline
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
