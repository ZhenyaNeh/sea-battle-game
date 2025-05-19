'use client';

import { Ship as ShipType } from '@/lib/types/shipTypes';
import React, { RefObject, useEffect, useMemo, useRef } from 'react';
import { cva } from 'class-variance-authority';

import { motion, useAnimation } from 'framer-motion';
import { useBoard } from '@/app/sea-battle/context/BoardContext';
import { cn } from '@/lib/utils';
import { throttle } from 'lodash';

interface ShipProps {
  ship: ShipType;
  containerRef: RefObject<HTMLDivElement | null>;
  position: string;
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
  'static border border-foreground cursor-pointer rounded-lg bg-foreground',
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

const Ship = ({ ship, containerRef, position }: ShipProps) => {
  const {
    handleDragStart,
    handleDrag,
    handleDragEnd,
    rotateShip,
    shipPositions,
  } = useBoard();
  const controls = useAnimation();
  const tapTimer = useRef<NodeJS.Timeout | null>(null);
  const shipRef = useRef<ShipType>(ship);

  // Определяем вариант корабля на основе актуальных пропсов
  const variant = useMemo(() => {
    const size = Math.max(ship.w + 1, ship.h + 1);
    const orientation = ship.w > ship.h ? 'hor' : 'vert';
    return `ship_${size}_${orientation}` as VariantType;
  }, [ship.w, ship.h]);

  // Проверяем видимость на основе актуальных данных
  const isVisible = useMemo(() => {
    return shipPositions.some((s) => s.id === ship.id);
  }, [ship.id, shipPositions]);

  // const variant =
  //   `ship_${Math.max(shipRef.current.w + 1, shipRef.current.h + 1)}_${shipRef.current.w > shipRef.current.h ? 'hor' : 'vert'}` as VariantType;

  // let visible = '';
  // for (const shipId in shipPositions) {
  //   if (shipPositions[shipId].id === shipRef.current.id) {
  //     visible = 'hidden';
  //     // visible = 'invisible';
  //   }
  // }

  const throttledHandleDrag = useMemo(
    () => throttle(handleDrag, 30),
    [handleDrag],
  );

  useEffect(() => {
    return () => throttledHandleDrag.cancel();
  }, [throttledHandleDrag]);

  return (
    <motion.div
      onTapStart={() => {
        tapTimer.current = setTimeout(() => {}, 150);
      }}
      onTap={() => {
        if (tapTimer.current) {
          clearTimeout(tapTimer.current);
          if (!rotateShip(shipRef)) {
            controls.start({
              x: [0, -8, 8, -8, 8, 0],
              transition: { duration: 0.5 },
            });
          }
        }
      }}
      onTapCancel={() => {
        if (tapTimer.current) {
          clearTimeout(tapTimer.current);
        }
      }}
      drag
      dragSnapToOrigin
      dragElastic={0.5}
      dragTransition={{ bounceStiffness: 170, bounceDamping: 12 }}
      dragConstraints={containerRef}
      onDragStart={(e, info) => handleDragStart(e, info, shipRef)}
      onDrag={(e, info) => throttledHandleDrag(e, info, shipRef)}
      onDragEnd={(e, info) => handleDragEnd(e, info, shipRef)}
      whileDrag={{ opacity: 0.3 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 1 }}
      animate={controls}
      // className={cn(
      //   shipVariants({ variant: variant }),
      //   position !== 'absolute' ? `static m-[8px] ${visible}` : 'absolute z-1',
      // )}
      className={cn(
        shipVariants({ variant }),
        position !== 'absolute'
          ? `static m-[8px] ${!isVisible ? '' : 'hidden'}`
          : 'absolute z-10',
      )}
    ></motion.div>
  );
};

export default Ship;
