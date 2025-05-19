'use client';

import { useGlobalReq } from '@/app/sea-battle/context/GlobalRequestContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
// import { useAuth } from '@/hooks/useAuth';

interface InviteDialogProps {
  friendId: string;
}

export function InviteDialog({ friendId }: InviteDialogProps) {
  // const { user } = useAuth();
  const { socket, isConnected } = useGlobalReq();

  const handleInvite = (gameId: string) => {
    if (!socket || !isConnected) return;

    // socket.emit('invite_friend', { gameId, friendId });
    socket.emit(
      'invite_friend',
      { gameId, friendId },
      (ack: {
        status: string;
        invitationId: string;
        message: 'Friend is offline';
      }) => {
        if (ack.status === 'invited') {
          toast.success('Invite send successfuly');
        } else {
          toast.info(ack.message);
        }
      },
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Invite</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Choose gamemode</DialogTitle>
          <DialogDescription>Choose gamemode.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-2">
            <Button
              type="submit"
              onClick={() => handleInvite('sea-battle-classic')}
            >
              Classic
            </Button>
            <Button
              type="submit"
              onClick={() => handleInvite('sea-battle-event')}
            >
              With Event
            </Button>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
