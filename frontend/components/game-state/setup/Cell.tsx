import { useBoard } from '@/app/sea-battle/context/BoardContext';
import React from 'react';
import Ship from './Ship';
import { Ship as ShipType } from '@/lib/types/shipTypes';

interface CellProps {
  id: string;
}

const Cell = ({ id }: CellProps) => {
  const { shipPositions, containerRef } = useBoard();
  const [x, y] = id?.split('-').slice(1).map(Number);

  const shipInCell: ShipType | null =
    shipPositions.find((ship) => ship.x === x && ship.y === y) || null;

  return (
    <div
      data-id={id}
      className={`cell-class w-10 h-10 border border-foreground rounded-lg inline-block ${shipInCell ? 'relative' : ''}`}
    >
      {shipInCell ? (
        <Ship
          ship={shipInCell}
          containerRef={containerRef}
          position="absolute"
        ></Ship>
      ) : (
        <></>
      )}
    </div>
  );
};
export default Cell;
