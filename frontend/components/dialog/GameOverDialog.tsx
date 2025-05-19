import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { UserService } from '@/lib/service/user.service';

import { useGame } from '@/app/sea-battle/context/GameContext';
import { Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export function GameOverDialog() {
  const {
    gameState,
    user,
    opponentInfo,
    liveShipsAfterBattle,
    openDialog,
    userCurrentRating,
    resultScore,
    setOpenDialog,
  } = useGame();
  const router = useRouter();

  const handleSubmit = () => {
    router.push('/');
  };

  const handleOpenChange = () => {
    setOpenDialog(!openDialog);
  };

  return (
    <Dialog open={openDialog} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="mb-5" variant="outline">
          Results of the battle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Results of the battle</DialogTitle>
          <DialogDescription>
            See your battle result here. Click go on home page when youre done.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center items-center py-4">
          <div className="flex flex-col justify-center items-center w-full">
            <h2 className="text-2xl font-bold mb-2">
              {gameState.winner === user?._id ? 'Winner' : 'Loser'}
            </h2>
            <Avatar className="size-20 font-medium text-3xl">
              <AvatarImage
                src={UserService.getProfilePhoto(user?.avatarUrl || '')}
              />
              <AvatarFallback>
                {user?.nickname?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold w-full text-center mt-4">
              {user?.nickname}
            </h2>
            <div className="flex justify-center items-center w-full">
              <Trophy className="w-5 h-5 mr-2" strokeWidth={2.8} />
              <h2 className="text-2xl font-bold">{`${userCurrentRating.current}`}</h2>
            </div>
            <h2 className="text-2xl font-bold">{`( ${gameState.winner === user?._id ? '+' : '-'}${resultScore.current.user} )`}</h2>
          </div>
          <div className="flex flex-col justify-center items-center w-full">
            <h2 className="text-2xl font-bold mb-2">
              {gameState.winner === user?._id ? 'Loser' : 'Winner'}
            </h2>
            <Avatar className="size-20 font-medium text-3xl">
              <AvatarImage
                src={UserService.getProfilePhoto(opponentInfo?.avatarUrl || '')}
              />
              <AvatarFallback>
                {opponentInfo?.nickname?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold w-full text-center mt-4">
              {opponentInfo?.nickname}
            </h2>
            <div className="flex justify-center items-center w-full">
              <Trophy className="w-5 h-5 mr-2" strokeWidth={2.8} />
              <h2 className="text-2xl font-bold">{`${opponentInfo?.rating}`}</h2>
            </div>
            <h2 className="text-2xl font-bold">{`( ${gameState.winner === user?._id ? '-' : '+'}${resultScore.current.opponent} )`}</h2>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold">
            Live ships after battle: {liveShipsAfterBattle.current}
          </h2>
        </div>
        <DialogFooter>
          <Button onClick={handleOpenChange} variant={'outline'}>
            See battle result
          </Button>
          <Button onClick={handleSubmit}>Go on home page</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
