'use client';

import { Ship } from '@/lib/types/shipTypes';
import {
  createContext,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { PanInfo } from 'framer-motion';
import {
  canPlace,
  canRotate,
  outOfBounds,
  placeShipsRandomly,
} from '@/lib/board';
import { getShipsForRandom } from '@/lib/common';

type BoardContextType = {
  shipPositions: Ship[];
  containerRef: RefObject<HTMLDivElement | null>;
  boardRef: RefObject<HTMLDivElement | null>;
  handleDragStart: (
    e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
    ship: React.RefObject<Ship>,
  ) => void;
  handleDragEnd: (
    e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
    ship: React.RefObject<Ship>,
  ) => void;
  handleDrag: (
    e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
    ship: React.RefObject<Ship>,
  ) => void;
  rotateShip: (ship: React.RefObject<Ship>) => boolean;
  handleGetRandomShipPositions: () => void;
};

const BoardContext = createContext<BoardContextType | null>(null);

export const BoardProvider = ({ children }: { children: React.ReactNode }) => {
  const [shipPositions, setShipPositions] = useState<Ship[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const lastCell = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // setBorderCells(shipPositions);
    setBorderCells(shipPositions, 'none');
  }, [shipPositions]);

  const handleDragStart = (
    e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
    ship: React.RefObject<Ship>,
  ) => {
    setBorderCells(shipPositions, 'none');
    setBorderCellsOne(ship.current);
  };

  const handleDrag = useCallback(
    async (
      e: MouseEvent | TouchEvent | PointerEvent,
      info: PanInfo,
      ship: React.RefObject<Ship>,
    ) => {
      const shipElement = e.target as HTMLElement;

      if (!shipElement || !shipElement.style) {
        return;
      }

      const target = getShipCord(shipElement, info, ship);

      if (target && target.classList.contains('cell-class')) {
        const targetElement = target as HTMLElement;

        const highlightShip = {
          ...ship.current,
        };

        const cordLast =
          targetElement.getAttribute('data-id') || 'cell-null-null';
        [highlightShip.x, highlightShip.y] = cordLast
          .split('-')
          .slice(1)
          .map(Number);

        highlightShip.y = Math.min(highlightShip.y, 9 - ship.current.w);
        highlightShip.x = Math.min(highlightShip.x, 9 - ship.current.h);

        const canPlaceShip = canPlace(shipPositions, highlightShip);

        if (lastCell.current && lastCell.current !== targetElement) {
          await setHighlightCells(lastCell.current, ship.current, '');
        }

        if (canPlaceShip) {
          await setHighlightCells(targetElement, highlightShip, '#fc573b');
          lastCell.current = targetElement;
        } else {
          await setHighlightCells(targetElement, highlightShip, '');
          lastCell.current = null;
        }
      } else {
        if (lastCell.current !== null) {
          await setHighlightCells(
            lastCell.current as HTMLElement,
            ship.current,
          );
          lastCell.current = null;
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shipPositions],
  );

  const handleDragEnd = (
    e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
    ship: React.RefObject<Ship>,
  ) => {
    const shipElement = e.target as HTMLElement;
    if (!shipElement || !shipElement.style) {
      return;
    }

    const target = getShipCord(shipElement, info, ship);

    if (target && target.classList.contains('cell-class')) {
      const cellId = target.getAttribute('data-id') || 'cell-null-null';
      const [x, y] = cellId?.split('-').slice(1).map(Number);

      const updatedShip = {
        ...ship.current,
        x: Math.min(x, 9 - ship.current.h),
        y: Math.min(y, 9 - ship.current.w),
      };

      let prevState: Ship | null = null;

      setBorderCells(shipPositions);
      setShipPositions((prev) => {
        prevState = prev.find((state) => state.id === ship.current.id) || null;

        const filteredShips = prev.filter(
          (innerShip) => innerShip.id !== ship.current.id,
        );

        if (!canPlace(shipPositions, updatedShip)) {
          setBorderCells(
            prevState ? [...filteredShips, prevState] : filteredShips,
            'none',
          );
          return prevState ? [...filteredShips, prevState] : filteredShips;
        }

        ship.current.x = updatedShip.x;
        ship.current.y = updatedShip.y;

        setBorderCells([...filteredShips, ship.current], 'none');
        return [...filteredShips, ship.current];
      });
    } else {
      setBorderCellsOne(ship.current, 'none');
    }
    if (lastCell.current) {
      setHighlightCells(lastCell.current, ship.current);
      lastCell.current = null;
    }
  };

  const rotateShip = (ship: React.RefObject<Ship>): boolean => {
    if (lastCell.current !== null) {
      setHighlightCells(lastCell.current as HTMLElement, ship.current, '');
      lastCell.current = null;
    }

    if (
      !outOfBounds([ship.current.x, ship.current.y]) &&
      canRotate(shipPositions, ship.current)
    ) {
      setBorderCellsOne(ship.current);
      const rotationShip = {
        ...ship.current,
        w: ship.current.h,
        h: ship.current.w,
      };

      setShipPositions((prev) =>
        prev.map((innerShip) =>
          innerShip.id === ship.current.id
            ? { ...innerShip, ...rotationShip }
            : innerShip,
        ),
      );

      ship.current.w = rotationShip.w;
      ship.current.h = rotationShip.h;
      return true;
    }
    setBorderCellsOne(ship.current, 'none');
    return false;
  };

  const getShipCord = (
    shipElement: HTMLElement,
    info: PanInfo,
    ship: React.RefObject<Ship>,
  ): HTMLElement | null => {
    const boardContainer = boardRef.current;
    if (!boardContainer) return null;

    shipElement.style.pointerEvents = 'none';
    const sampleCell = boardContainer.querySelector('.cell-class');
    const cellSize = sampleCell?.getBoundingClientRect().width || 40;
    const gridSize = 2;

    const totalCellSize = cellSize + gridSize;

    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    const boardRect = boardContainer.getBoundingClientRect();

    // Получаем координаты касания относительно кораблика
    const shipRect = shipElement.getBoundingClientRect();
    const offsetX = info.point.x - scrollX - shipRect.left - 20;
    const offsetY = info.point.y - scrollY - shipRect.top - 20;

    const adjustedX =
      info.point.x - scrollX - boardRect.left - cellSize - offsetX;
    const adjustedY =
      info.point.y - scrollY - boardRect.top - cellSize - offsetY;

    if (
      adjustedX < 0 ||
      adjustedY < 0 ||
      adjustedX > boardRect.width ||
      adjustedY > boardRect.height
    ) {
      shipElement.style.pointerEvents = 'auto';
      if (lastCell.current !== null) {
        setHighlightCells(lastCell.current as HTMLElement, ship.current, '');
        lastCell.current = null;
      }
      return null;
    }

    const col = Math.floor(adjustedX / totalCellSize);
    const row = Math.floor(adjustedY / totalCellSize);

    const target = boardContainer.querySelector(
      `.cell-class[data-id="cell-${row}-${col}"]`,
    ) as HTMLElement;
    shipElement.style.pointerEvents = 'auto';

    return target;
  };

  async function setHighlightCells(
    cell: HTMLElement,
    ship: Ship,
    color: string = '',
  ) {
    if (cell !== null) {
      const cordLast = cell.getAttribute('data-id') || 'cell-null-null';
      let [x, y] = cordLast.split('-').slice(1).map(Number);

      y = Math.min(y, 9 - ship.w);
      x = Math.min(x, 9 - ship.h);

      if (!outOfBounds([x, y])) {
        for (let i = 0; i <= ship.w; i++) {
          for (let j = 0; j <= ship.h; j++) {
            const cell = document.querySelector(
              `.cell-class[data-id="cell-${x + j}-${y + i}"]`,
            ) as HTMLElement | null;
            if (cell) cell.style.backgroundColor = color;
          }
        }
      }
    }
  }

  function setBorderCellsOne(ship: Ship, border: string = '') {
    const { x, y } = ship;
    for (let i = 0; i <= ship.w; i++) {
      for (let j = 0; j <= ship.h; j++) {
        const cell = document.querySelector(
          `.cell-class[data-id="cell-${x + j}-${y + i}"]`,
        ) as HTMLElement | null;
        if (cell) cell.style.border = border;
      }
    }
  }

  function setBorderCells(ships: Ship[], border: string = '') {
    for (const ship of ships) {
      const { x, y } = ship;
      for (let i = 0; i <= ship.w; i++) {
        for (let j = 0; j <= ship.h; j++) {
          const cell = document.querySelector(
            `.cell-class[data-id="cell-${x + j}-${y + i}"]`,
          ) as HTMLElement | null;
          if (cell) cell.style.border = border;
        }
      }
    }
  }

  // function handleGetRandomShipPositions() {
  //   setBorderCells(shipPositions);
  //   setShipPositions([]);
  //   const randomShipPosition = placeShipsRandomly(getShipsForRandom());
  //   setShipPositions(randomShipPosition);
  //   setTimeout(() => {
  //     setBorderCells(randomShipPosition, 'none');
  //   }, 100);
  //   console.log(randomShipPosition);
  //   console.log(shipPositions);
  // }

  function handleGetRandomShipPositions() {
    setBorderCells(shipPositions);
    // setShipPositions([]);
    const newPositions = placeShipsRandomly(getShipsForRandom());
    // for (const shipPos of newPositions) {
    //   setShipPositions((prev) => {
    //     return [...prev, shipPos];
    //   });
    // }

    updateShips(newPositions);
    console.log('Generated positions:', newPositions);
    console.log('Generated positions:', shipPositions);
    // setBorderCells(shipPositions, 'none');
  }

  const updateShips = useCallback((newShips: Ship[]) => {
    setShipPositions((prev) => {
      // Проверяем, действительно ли позиции изменились
      if (JSON.stringify(prev) === JSON.stringify(newShips)) {
        return prev;
      }
      return [...newShips]; // Всегда новый массив
    });
  }, []);

  // const handleGetRandomShipPositions = useCallback(() => {
  //   // Создаем глубокую копию текущих позиций
  //   setBorderCells(shipPositions);
  //   const currentPositions = [...shipPositions];

  //   // Очищаем позиции синхронно
  //   // setShipPositions([]);

  //   // Генерируем новые позиции
  //   const newPositions = placeShipsRandomly(getShipsForRandom());

  //   // Проверяем новые позиции перед установкой
  //   if (isValidShipPlacement(newPositions)) {
  //     setShipPositions(() => {
  //       const newPos = newPositions;

  //       return newPos;
  //     });
  //     setBorderCells(newPositions, 'none');

  //     console.log('Generated positions:', newPositions);
  //     console.log('Current state positions:', shipPositions);
  //   } else {
  //     // В случае ошибки возвращаем предыдущие позиции
  //     setShipPositions(currentPositions);
  //     console.error('Invalid ship placement generated');
  //   }
  // }, [shipPositions, setShipPositions, setBorderCells]);

  // function isValidShipPlacement(positions: Ship[]): boolean {
  //   // Проверяем, что все корабли размещены корректно
  //   for (let i = 0; i < positions.length; i++) {
  //     for (let j = i + 1; j < positions.length; j++) {
  //       if (checkShipOverlaps(positions[i], positions[j])) {
  //         return false;
  //       }
  //     }
  //     if (outOfBounds([positions[i].x, positions[i].y])) {
  //       return false;
  //     }
  //   }
  //   return true;
  // }

  return (
    <BoardContext.Provider
      value={{
        shipPositions,
        containerRef,
        boardRef,
        handleDragStart,
        handleDragEnd,
        handleDrag,
        rotateShip,
        handleGetRandomShipPositions,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoard must be used within a BorderProvider');
  }
  return context;
};
