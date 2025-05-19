'use client';

import { Ship as ShipType } from '@/lib/types/shipTypes';
import React, { useRef } from 'react';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

interface ShipProps {
  ship: ShipType;
}

type VariantType =
  | 'ship_4_hor'
  | 'ship_4_vert'
  | 'ship_3_hor'
  | 'ship_3_vert'
  | 'ship_2_hor'
  | 'ship_2_vert'
  | 'ship_1_hor'
  | 'ship_1_vert';

const shipVariants = cva(
  'static border border-foreground rounded-lg bg-foreground',
  {
    variants: {
      variant: {
        ship_4_hor: 'w-[166px] h-[40px]',
        ship_4_vert: 'w-[40px] h-[166px]',
        ship_3_hor: 'w-[124px] h-[40px]',
        ship_3_vert: 'w-[40px] h-[124px]',
        ship_2_hor: 'w-[82px] h-[40px]',
        ship_2_vert: 'w-[40px] h-[82px]',
        ship_1_hor: 'w-[40px] h-[40px]',
        ship_1_vert: 'w-[40px] h-[40px]',
      },
    },
  },
);

const Ship = ({ ship }: ShipProps) => {
  // const { userShipPositions } = useGame();
  const shipRef = useRef<ShipType>(ship);

  const variant =
    `ship_${Math.max(shipRef.current.w + 1, shipRef.current.h + 1)}_${shipRef.current.w > shipRef.current.h ? 'hor' : 'vert'}` as VariantType;

  // let visible = '';
  // for (const shipId in userShipPositions) {
  //   if (userShipPositions[shipId].id === shipRef.current.id) {
  //     visible = 'hidden';
  //     // visible = 'invisible';
  //   }
  // }

  return (
    <div
      className={cn(shipVariants({ variant: variant }), 'absolute z-1')}
    ></div>
  );
};

export default Ship;
