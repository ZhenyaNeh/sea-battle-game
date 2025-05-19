import { getSetupShips } from '@/lib/common';
import { JSX, useState } from 'react';
import Ship from './Ship';
import { Ship as ShipType } from '@/lib/types/shipTypes';
import { useBoard } from '@/app/sea-battle/context/BoardContext';

const SelectBoard = () => {
  const [ships] = useState<ShipType[][]>(getSetupShips());
  const { containerRef } = useBoard();
  const holders: JSX.Element[] = [];

  for (let i = ships.length - 1; i >= 0; i--) {
    const shipRow = ships[i];
    const shipArr = [];

    for (let b = 0; b < shipRow.length; b++) {
      const ship = shipRow[b];
      const elem = (
        <Ship
          key={b}
          ship={ship}
          containerRef={containerRef}
          position={'static'}
        />
      );
      shipArr.push(elem);
    }

    holders.push(
      <div key={i} className="flex min-h-[60px]">
        {shipArr}
      </div>,
    );
  }
  return (
    <div className="flex-1 content-center items-center border border-border rounded-2xl py-3 h-full">
      <h2 className="text-center font-bold text-2xl">
        Drag the ships onto the board
      </h2>
      <div className="">
        <div className="p-2.5">{holders}</div>
      </div>
      <h2 className="text-center text-border">To rotate click on the ship</h2>
    </div>
  );
};

export default SelectBoard;
