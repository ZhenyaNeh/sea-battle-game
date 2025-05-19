// import { useBoard } from '@/app/sea-battle/context/BoardContext';
import React from 'react';
// import Ship from '../Ship';
import { Ship as ShipType } from '@/lib/types/shipTypes';
import { useGame } from '@/app/sea-battle/context/GameContext';
import Ship from './Ship';
import { motion } from 'framer-motion';
import { Dot, X } from 'lucide-react';
import { TypeOfGameEvents } from '@/lib/emum';
// import { shipFireHit } from '@/lib/board';

interface CellProps {
  id: string;
  isUser: boolean;
}
const cellVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10,
    },
  },
  hover: {
    scale: 1.1,
    transition: {
      duration: 0.1,
    },
  },
};

const Cell = ({ id, isUser }: CellProps) => {
  const {
    userShipPositions,
    fireEvent,
    gameState,
    opponentShips,
    currentEvent,
    // hoveredCell,
    // setHoveredCell,
    setHighlightCellsRocket,
    setHighlightCellsRadar,
  } = useGame();
  const [x, y] = id?.split('-').slice(1).map(Number);

  // const isNeighborHighlighted =
  //   hoveredCell &&
  //   ((x === hoveredCell.x && Math.abs(y - hoveredCell.y) === 1) ||
  //     (y === hoveredCell.y && Math.abs(x - hoveredCell.x) === 1));

  let shipInCell: ShipType | null = null;
  let shipInOpponentCell: ShipType | null = null;

  if (userShipPositions && isUser) {
    for (const innerShip of userShipPositions) {
      if (innerShip.x === x && innerShip.y === y) {
        shipInCell = innerShip;
      }
    }
  }

  if (gameState.gameOver && !isUser && opponentShips) {
    for (const innerShip of opponentShips) {
      if (innerShip.x === x && innerShip.y === y) {
        shipInOpponentCell = innerShip;
      }
    }
  }

  const handleHighlith = () => {
    if (currentEvent === TypeOfGameEvents.rocket && !isUser)
      setHighlightCellsRocket(x, y, '#fc573b');
    if (currentEvent === TypeOfGameEvents.radar && !isUser)
      setHighlightCellsRadar(x, y, '#fc573b');
  };
  const handleClear = () => {
    if (currentEvent === TypeOfGameEvents.rocket && !isUser)
      setHighlightCellsRocket(x, y, '');
    if (currentEvent === TypeOfGameEvents.radar && !isUser)
      setHighlightCellsRadar(x, y, '');
  };

  const isHitInCell = gameState.board[x][y];
  const isHitInOpponentCell = gameState.opponentBoard[x][y];

  const handleFireEvent = () => {
    if (isUser || gameState.gameOver) return;
    handleClear();
    fireEvent(x, y);
  };

  return (
    <motion.div
      data-id={id}
      variants={cellVariants} // Подключаем варианты анимации
      whileHover={'hover'}
      onClick={handleFireEvent}
      onMouseEnter={handleHighlith}
      onMouseLeave={handleClear}
      onTouchStart={handleHighlith}
      onTouchEnd={handleClear}
      className={`${isUser ? 'cell-class' : 'cell-class cell-highlight hover:bg-muted cursor-pointer'} ${currentEvent === TypeOfGameEvents.radar || currentEvent === TypeOfGameEvents.rocket ? '' : ''} w-10 h-10 border border-foreground rounded-lg inline-block ${shipInCell || shipInOpponentCell ? 'relative border-none' : ''}`}
    >
      {isUser && shipInCell ? <Ship ship={shipInCell} /> : null}

      {isUser && isHitInCell ? (
        isHitInCell === 'hit' ? (
          <X className="h-full w-full stroke-background relative z-10"></X>
        ) : (
          <Dot className="h-full w-full"></Dot>
        )
      ) : (
        <></>
      )}

      {!isUser && !gameState.gameOver && isHitInOpponentCell ? (
        isHitInOpponentCell === 'hit' ? (
          <X className="h-full w-full"></X>
        ) : (
          <Dot className="h-full w-full"></Dot>
        )
      ) : (
        <></>
      )}

      {!isUser && shipInOpponentCell ? (
        <Ship ship={shipInOpponentCell} />
      ) : null}

      {!isUser && gameState.gameOver && isHitInOpponentCell ? (
        isHitInOpponentCell === 'hit' ? (
          <X className="h-full w-full stroke-background relative z-10"></X>
        ) : (
          <Dot className="h-full w-full"></Dot>
        )
      ) : (
        <></>
      )}
    </motion.div>
  );
};
export default Cell;
