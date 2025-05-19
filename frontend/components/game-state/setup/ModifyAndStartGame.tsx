'use client';

import { useBoard } from '@/app/sea-battle/context/BoardContext';
import { useMatchmaking } from '@/app/sea-battle/context/MathcmakingContext';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

const ModifyAndStartGame = () => {
  const { shipPositions, handleGetRandomShipPositions } = useBoard();
  const { user } = useAuth();
  const { socket, isConnected } = useMatchmaking();
  const [isSearching, setIsSearching] = useState(false);
  const searchParams = useSearchParams();
  const gameId = searchParams.get('game-id');
  const rating = user?.rating;
  const router = useRouter();
  const privateRoomParam = searchParams.get('private-room') || '';

  useEffect(() => {
    if (!socket) return;

    const handleMatchFound = (data: { roomId: string }) => {
      setIsSearching(false);
      toast.success('Match Found!');
      router.push(`/sea-battle/${data.roomId}`);
    };

    const handleOpponentReady = () => {
      toast.success('Opponent ready.');
    };

    const handleOpponentCancelled = () => {
      toast.success('Opponent cancelled.');
    };

    socket.on('match_found', handleMatchFound);
    socket.on('opponent_ready', handleOpponentReady);
    socket.on('opponent_cancelled', handleOpponentCancelled);

    return () => {
      toast.dismiss();
      socket.off('match_found', handleMatchFound);
      socket.off('opponent_ready', handleOpponentReady);
      socket.off('opponent_cancelled', handleOpponentCancelled);

      if (isSearching) {
        socket.emit('cancel_search', { gameId }, () => {
          toast.dismiss();
          // console.log('test');
          // toast.info('Match Found');
        });
        // socket.disconnect();
      }
    };
  }, [socket, router, isSearching, gameId]);

  const handleSearch = () => {
    if (!socket || !isConnected) {
      toast.error('Connection error');
      return;
    }

    // const shipPositionsSend = JSON.stringify();
    setIsSearching(true);
    socket.emit(
      'search',
      { gameId, rating, ships: shipPositions },
      (response: { status: string }) => {
        if (response.status === 'searching') {
          toast.loading('Match search');
        }
      },
    );
  };

  const handleReady = () => {
    if (!socket || !isConnected) {
      toast.error('Connection error');
      return;
    }

    setIsSearching(true);
    socket.emit(
      'ready',
      { roomId: privateRoomParam, ships: shipPositions },
      (response: { status: string }) => {
        if (response.status === 'searching') {
          toast.loading('Wait opponent.');
        }
      },
    );
  };

  const handleCancelReady = () => {
    if (!socket || !isConnected) return;

    socket.emit(
      'cancel_ready',
      { roomId: privateRoomParam },
      (result: { status: string }) => {
        setIsSearching(false);
        toast.dismiss();
        if (result.status === 'ready_cancelled') toast.info('Ready cancelled');
      },
    );
  };

  const handleCancelSearch = () => {
    if (!socket || !isConnected) return;

    socket.emit('cancel_search', { gameId }, () => {
      setIsSearching(false);
      toast.dismiss();
      toast.info('Search cancelled');
    });
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isSearching && socket) {
        socket.emit('cancel_search', { gameId });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [gameId, isSearching, socket]);

  return (
    <div className="flex-1 content-center items-center border border-border rounded-2xl p-3 h-full">
      <h2 className="text-center font-bold text-2xl">Setup start game</h2>
      <div className="flex w-full justify-center items-center mt-5 flex-wrap">
        <h3 className="w-full text-center my-3">
          Youre status: {isConnected ? 'Online' : 'Offline'}
        </h3>
        <div className="w-full flex justify-center items-center py-5">
          <Button onClick={handleGetRandomShipPositions}>Rundomise ship</Button>
        </div>

        {!isSearching ? (
          <>
            {privateRoomParam === '' ? (
              <Button
                disabled={shipPositions.length !== 10}
                onClick={handleSearch}
              >
                Start search
              </Button>
            ) : (
              <Button
                disabled={shipPositions.length !== 10}
                onClick={handleReady}
              >
                Ready
              </Button>
            )}
          </>
        ) : (
          <>
            <div className=" flex w-full p-3 justify-center items-center">
              <Loader2 className="animate-spin" />
            </div>
            {privateRoomParam === '' ? (
              <Button variant={'outline'} onClick={handleCancelSearch}>
                Cancel search
              </Button>
            ) : (
              <Button variant={'outline'} onClick={handleCancelReady}>
                Cancel ready
              </Button>
            )}
          </>
        )}
        {/* {privateRoomParam !== '' ? (
          <></>
        ) : (
          <>
            <div className=" flex w-full p-3 justify-center items-center">
              <Loader2 className="animate-spin" />
            </div>
            <Button variant={'outline'} onClick={handleCancelReady}>
              Cancel
            </Button>
          </>
        )} */}
      </div>
    </div>
  );
};

export default ModifyAndStartGame;
