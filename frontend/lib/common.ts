// import {
//   canPlace,
//   equalsArray,
//   getBoundsCells,
//   getOverlapCells,
// } from './board';
// import { Cell, Ship, ShipCord } from './types/shipTypes';

// Генерирует случайное целое число в диапазоне от min до max включительно
export function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Вычисляет масштаб для адаптации игрового поля под разные размеры экрана
export function getScale([width, height]: number[]): number {
  return Math.min(width / 1280, height / 720);
}

// Преобразует числовой код в символ (букву).
export function getChar(code: number): string {
  return String.fromCharCode(97 + code).toUpperCase();
}

// Линейно преобразует значение из одного диапазона в другой
export function map(
  value: number,
  start1: number,
  stop1: number,
  start2: number,
  stop2: number,
): number {
  return ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

// Ограничивает значение value диапазоном от min до max
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function handleBrokenWeaponShot(
  originalX: number,
  originalY: number,
): [number, number] {
  if (Math.random() > 0.75) {
    return [originalX, originalY];
  }

  let offsetX: number;
  let offsetY: number;

  do {
    offsetX = Math.floor(Math.random() * 3) - 1; // -1, 0 или 1
    offsetY = Math.floor(Math.random() * 3) - 1; // -1, 0 или 1
  } while (offsetX === 0 && offsetY === 0); // Исключаем вариант (0, 0)

  // Вычисляем новые координаты и проверяем границы поля
  const newX = Math.max(0, Math.min(9, originalX + offsetX));
  const newY = Math.max(0, Math.min(9, originalY + offsetY));

  return [newX, newY];
}

export function handleRocketShot(
  centerX: number,
  centerY: number,
): [number, number][] {
  const cells: [number, number][] = [[centerX, centerY]];

  const directions = [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
  ];

  for (const [dx, dy] of directions) {
    const x = centerX + dx;
    const y = centerY + dy;

    // Проверяем, не вышли ли за границы поля
    if (x >= 0 && x < 10 && y >= 0 && y < 10) {
      cells.push([x, y]);
    }
  }

  return cells;
}

// Генерирует список возможных ходов на игровом поле в зависимости от сложности
// export function getMoves(
//   board: Ship[] | null = null,
//   difficulty: number | null = null,
// ): Cell[] {
//   const moves: Cell[] = [];
//   for (let i = 0; i < 10; i++) {
//     for (let b = 0; b < 10; b++) {
//       moves.push([i, b]);
//     }
//   }

//   if (board !== null && difficulty !== null) {
//     const outputMoves: Cell[] = [];
//     const cells = board
//       .map((ship) =>
//         getOverlapCells({ x: ship.x, y: ship.y, w: ship.w, h: ship.h }),
//       )
//       .flat();
//     const boundCells = board.map((ship) => getBoundsCells(ship)).flat();

//     if (difficulty === 0) outputMoves.push(...moves);
//     if (difficulty === 1 || difficulty === 2) {
//       const type = {
//         1: 0,
//         2: 20,
//       };
//       outputMoves.push(...cells);
//       for (let i = boundCells.length - 1; i >= type[difficulty]; i -= 1) {
//         const move = boundCells[i];
//         const hasRepeat = outputMoves.find((smove) => equalsArray(smove, move));

//         if (!hasRepeat) {
//           outputMoves.push(move);
//         }
//         boundCells.splice(i, 1);
//       }
//     }
//     return outputMoves;
//   }

//   return moves;
// }

// Возвращает начальную конфигурацию кораблей для игры.
export function getSetupShips() {
  return [
    [
      { id: 6, x: -1, y: -1, w: 0, h: 0, health: 1 },
      { id: 7, x: -1, y: -1, w: 0, h: 0, health: 1 },
      { id: 8, x: -1, y: -1, w: 0, h: 0, health: 1 },
      { id: 9, x: -1, y: -1, w: 0, h: 0, health: 1 },
    ],
    [
      { id: 3, x: -1, y: -1, w: 1, h: 0, health: 2 },
      { id: 4, x: -1, y: -1, w: 1, h: 0, health: 2 },
      { id: 5, x: -1, y: -1, w: 1, h: 0, health: 2 },
    ],
    [
      { id: 1, x: -1, y: -1, w: 2, h: 0, health: 3 },
      { id: 2, x: -1, y: -1, w: 2, h: 0, health: 3 },
    ],
    [{ id: 0, x: -1, y: -1, w: 3, h: 0, health: 4 }],
  ];
}

export function getShipsForRandom() {
  return [
    { id: 6, x: -1, y: -1, w: 0, h: 0, health: 1 },
    { id: 7, x: -1, y: -1, w: 0, h: 0, health: 1 },
    { id: 8, x: -1, y: -1, w: 0, h: 0, health: 1 },
    { id: 9, x: -1, y: -1, w: 0, h: 0, health: 1 },
    { id: 3, x: -1, y: -1, w: 1, h: 0, health: 2 },
    { id: 4, x: -1, y: -1, w: 1, h: 0, health: 2 },
    { id: 5, x: -1, y: -1, w: 1, h: 0, health: 2 },
    { id: 1, x: -1, y: -1, w: 2, h: 0, health: 3 },
    { id: 2, x: -1, y: -1, w: 2, h: 0, health: 3 },
    { id: 0, x: -1, y: -1, w: 3, h: 0, health: 4 },
  ];
}

// export function getSetupShips() {
//   return [
//     { id: 0, x: -1, y: -1, w: 3, h: 0, health: 4 },
//     { id: 1, x: -1, y: -1, w: 2, h: 0, health: 3 },
//     { id: 2, x: -1, y: -1, w: 2, h: 0, health: 3 },
//     { id: 3, x: -1, y: -1, w: 1, h: 0, health: 2 },
//     { id: 4, x: -1, y: -1, w: 1, h: 0, health: 2 },
//     { id: 5, x: -1, y: -1, w: 1, h: 0, health: 2 },
//     { id: 6, x: -1, y: -1, w: 0, h: 0, health: 1 },
//     { id: 7, x: -1, y: -1, w: 0, h: 0, health: 1 },
//     { id: 8, x: -1, y: -1, w: 0, h: 0, health: 1 },
//     { id: 9, x: -1, y: -1, w: 0, h: 0, health: 1 },
//   ];
// }

// // Генерирует случайную расстановку кораблей на игровом поле
// export function generateBoard() {
//   const defaultShips = getSetupShips().flat();
//   const moves: Cell[] = getMoves();

//   function removeMoves(movesToDelete: Cell[]) {
//     for (const [x, y] of movesToDelete) {
//       const index = moves.findIndex(([posX, posY]) => posX === x && posY === y);
//       if (index >= 0) moves.splice(index, 1);
//     }
//   }
//   const newShips: Ship[] = [];

//   while (newShips.length !== 10 && moves.length && defaultShips.length) {
//     const index = random(0, moves.length - 1);
//     const [x, y] = moves[index];
//     const shipIndex = defaultShips.length - 1;
//     const ship = defaultShips[shipIndex];

//     function tryBoth(w: number, h: number) {
//       const cord: ShipCord = { x, y, w, h };
//       const cells = getOverlapCells(cord);
//       const isAble = canPlace(
//         newShips,
//         cord,
//         { id: 0, x: -1, y: -1, w: 0, h: 0, health: 0 },
//         0,
//       );
//       const isAbleToPlaceShip = isAble && cells.length === Math.max(w, h) + 1;
//       if (isAbleToPlaceShip) {
//         ship.x = x;
//         ship.y = y;
//         ship.w = w;
//         ship.h = h;

//         const boundCells = getBoundsCells(ship);
//         removeMoves(boundCells);
//         removeMoves(cells);
//         defaultShips.splice(shipIndex, 1);
//         newShips.push(ship);
//         return true;
//       }
//       return false;
//     }
//     const tried = tryBoth(ship.w, ship.h);
//     if (!tried) {
//       tryBoth(ship.h, ship.w);
//     }
//   }
//   return newShips;
// }
