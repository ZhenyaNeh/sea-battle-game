'use client';

import GameBoard from '@/components/game-state/GameBoard';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import {
  ArrowBigLeft,
  ArrowBigRight,
  Loader2,
  Volume2,
  VolumeOff,
} from 'lucide-react';
import { GameOverDialog } from '@/components/dialog/GameOverDialog';
import EventDialog from '@/components/dialog/EventDialog';
import { useAuth } from '@/hooks/useAuth';
import { useSound } from '@/lib/sounds/SoundContext';

interface RoomParams {
  roomId: string;
  [key: string]: string | string[] | undefined;
}

const Room = () => {
  const params = useParams<RoomParams>();
  const { user } = useAuth();
  const { gameState, isConnected, eventDialog, currentGameType, fetchData } =
    useGame();
  const { playBackgroundMusic, stopBackgroundMusic, toggleMute, isMuted } =
    useSound();

  useEffect(() => {
    if (!user) return;
    fetchData(params.roomId);
    // playBackgroundMusic();
    toggleMute();

    return () => {
      stopBackgroundMusic();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (!user) return;
    playBackgroundMusic();

    return () => {
      stopBackgroundMusic();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isMuted]);

  return (
    <div className="w-full flex justify-center items-center flex-wrap">
      <h1 className="w-full text-center font-bold text-3xl mb-10">
        Sea Battle
      </h1>
      <div className="flex w-full justify-center items-center mb-5">
        <button onClick={toggleMute}>
          {isMuted ? (
            <div className="flex w-full justify-center items-center">
              <VolumeOff className="mr-2" /> Sound off
            </div>
          ) : (
            <div className="flex w-full justify-center items-center">
              <Volume2 className="mr-2" /> Sound on
            </div>
          )}
        </button>
      </div>
      {gameState.gameOver ? <GameOverDialog /> : <></>}
      {currentGameType.current !== 'sea-battle-classic' &&
      eventDialog &&
      !gameState.gameOver ? (
        <EventDialog />
      ) : (
        <></>
      )}
      {isConnected ? (
        <div className="w-full flex justify-between items-center flex-wrap">
          <GameBoard isUser={true} />
          <>
            {gameState.currentTurn ? (
              <ArrowBigRight size={50} />
            ) : (
              <ArrowBigLeft size={50} />
            )}
            {/* {gameState.currentTurn ? (
            isMobile ? (
              <ArrowBigDown size={50} />
            ) : (
              <ArrowBigRight size={50} />
            )
          ) : isMobile ? (
            <ArrowBigUp size={50} />
          ) : (
            <ArrowBigLeft size={50} />
          )} */}
          </>
          <GameBoard isUser={false} />
        </div>
      ) : (
        <Loader2 className="animate-spin" size={50} />
      )}

      <h2 className="w-full text-muted-foreground text-center font-medium text-ml mt-10">
        Room ID: {params.roomId}
      </h2>
    </div>
  );
};

export default Room;
