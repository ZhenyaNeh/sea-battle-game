import React from 'react';
import SymbolCell from './setup/SymbolCell';
import Cell from './setup/Cell';
import { getChar } from '@/lib/common';
import { useBoard } from '@/app/sea-battle/context/BoardContext';

const SetupBoard = () => {
  const gridSize = 10;
  const { boardRef } = useBoard();

  return (
    <div className="flex-2 justify-center items-center border border-border rounded-2xl mx-5">
      <h2 className="text-center font-bold text-2xl pt-2">Your Board</h2>
      <div className="flex justify-center items-center p-5">
        <div
          ref={boardRef}
          className="grid grid-cols-[repeat(12,40px)] gap-0.5"
        >
          <SymbolCell key={'top-left'} symbol=" " />
          {Array.from({ length: gridSize }).map((_, index) => (
            <SymbolCell key={`top-${index}`} symbol={getChar(index)} />
          ))}
          <SymbolCell key={'top-right'} symbol=" " />
          {Array.from({ length: gridSize }).map((_, x) => (
            <React.Fragment key={`row-${x}`}>
              {/* Цифра слева */}
              <SymbolCell key={`left-${x}`} symbol={(x + 1).toString()} />

              {/* Ячейки игрового поля */}
              {Array.from({ length: gridSize }).map((_, y) => (
                <Cell key={`cell-${x}-${y}`} id={`cell-${x}-${y}`} />
              ))}

              {/* Цифра справа */}
              <SymbolCell key={`right-${x}`} symbol={(x + 1).toString()} />
            </React.Fragment>
          ))}
          <SymbolCell key={'bottom-left'} symbol=" " />
          {Array.from({ length: gridSize }).map((_, index) => (
            <SymbolCell key={`bottom-${index}`} symbol={getChar(index)} />
          ))}
          <SymbolCell key={'bottom-right'} symbol=" " />
        </div>
      </div>
    </div>
  );
};

export default SetupBoard;
