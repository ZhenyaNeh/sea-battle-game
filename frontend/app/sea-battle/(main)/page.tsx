'use client';

import React from 'react';
import { useBoard } from '../context/BoardContext';
import SelectBoard from '@/components/game-state/setup/SelectBoard';
import SetupBoard from '@/components/game-state/SetupBoard';
import ModifyAndStartGame from '@/components/game-state/setup/ModifyAndStartGame';

const SetupPage = () => {
  const { containerRef } = useBoard();

  return (
    <div className="w-full flex justify-center items-center flex-wrap">
      <h1 className="w-full text-2x text-center font-bold text-3xl mb-10">
        Arrange the ships
      </h1>
      <div
        ref={containerRef}
        className="flex justify-between items-top w-full flex-wrap"
      >
        <SelectBoard></SelectBoard>
        <SetupBoard></SetupBoard>
        <ModifyAndStartGame></ModifyAndStartGame>
      </div>
    </div>
  );
};

export default SetupPage;
