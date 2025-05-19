'use client';

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
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

interface GameStartDialogProps {
  type: string;
}

export function GameStartDialog({ type }: GameStartDialogProps) {
  const { isAuth } = useAuth();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={!isAuth}>
          Get Start
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Choose game</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when youre done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-2">
            <Button type="submit">
              <Link
                href={`/sea-battle?game-mode=online&game-id=sea-battle-${type}`}
              >
                Play Online
              </Link>
            </Button>
            <Button type="submit">
              <Link
                href={`/friends?game-mode=friend&game-id=sea-battle-${type}`}
              >
                Play with friend
              </Link>
            </Button>
            {/* <Button type="submit">
              <Link
                href={`/sea-battle?game-mode=bot&game-id=sea-battle-${type}`}
              >
                Play with bot
              </Link>
            </Button> */}
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
