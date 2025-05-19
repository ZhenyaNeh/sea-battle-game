import { Cell, Position, Ship, ShipCord } from './types/shipTypes';

// Checks if the point is outside the board
// Проверяет, находится ли точка (x, y) за пределами игрового поля
// Возвращает: true, если точка за пределами поля, иначе false
export function outOfBounds([x, y]: Position): boolean {
  return x < 0 || y < 0 || x > 9 || y > 9;
}

// Сравнивает два массива a и b на равенство
export function equalsArray(a: Cell, b: Cell): boolean {
  return a.every((item, index) => item === b[index]);
}

// Rectangle collision, but size of the second rectangle increased by 1
// Проверяет, пересекаются ли два прямоугольника, причем размер второго прямоугольника увеличен на i = 1.
export function shipOverlaps(
  pos1: Ship | ShipCord,
  pos2: Ship | ShipCord,
  i: number = 1,
): boolean {
  return (
    pos1.y + pos1.w < pos2.y - i ||
    pos1.x + pos1.h < pos2.x - i ||
    pos1.y > pos2.y + pos2.w + i ||
    pos1.x > pos2.x + pos2.h + i
  );
}

export function shipFireHit(ship: Ship, x: number, y: number): boolean {
  const shipEndX = ship.x + ship.h;
  const shipEndY = ship.y + ship.w;

  if (x >= ship.x && x <= shipEndX && y >= ship.y && y <= shipEndY) {
    return true; // Попадание
  }

  return false; // Промах
}

export function canPlace(shipPositions: Ship[], ship: Ship): boolean {
  for (const shipInner of shipPositions) {
    if (shipInner.id !== ship.id && !shipOverlaps(shipInner, ship)) {
      return false;
    }
  }
  return true;
}

// Проверяет, можно ли повернуть корабль на доске
export function canRotate(board: Ship[], ship: Ship): boolean {
  const rotationShip = {
    ...ship,
    w: ship.h,
    h: ship.w,
  };

  const cellsInBoard = getOverlapCells(rotationShip);

  return (
    canPlace(board, rotationShip) && cellsInBoard.length === rotationShip.health
  );
}

// Проверяет, можно ли разместить корабль на доске без пересечения с другими кораблями
// export function canPlace(
//   board: Ship[],
//   hoverPosition: ShipCord,
//   shipPosition: Ship,
//   i: number = 1,
// ): boolean {
//   return (
//     board.filter(
//       (ship) => ship !== shipPosition && !shipOverlaps(hoverPosition, ship, i),
//     ).length === 0
//   );
// }

// Возвращает клетки, которые находятся в пределах поля при размещении корабля
export function getOverlapCells(ship: Ship): Cell[] {
  const cells: Cell[] = [];

  for (let x = ship.x; x <= ship.x + ship.h; x++) {
    for (let y = ship.y; y <= ship.y + ship.w; y++) {
      const pos: Cell = [x, y];
      if (!outOfBounds(pos)) {
        cells.push(pos);
      }
    }
  }
  return cells;
}

// Возвращает клетки, которые находятся вокруг корабля, включая его границы
export function getBoundsCells(ship: Ship): Cell[] {
  const { x, y, w, h } = ship;
  const shipPosition: ShipCord = { x, y, w, h };
  const [x1, y1, x2, y2] = [x - 1, y - 1, x + w + 1, y + h + 1];

  const cells: Cell[] = [];
  for (let i = x1; i <= x2; i++) {
    for (let b = y1; b <= y2; b++) {
      const pos: Cell = [i, b];
      const hoverPosition: ShipCord = { x: i, y: b, w: 0, h: 0 };
      if (!outOfBounds(pos) && shipOverlaps(hoverPosition, shipPosition, 0)) {
        cells.push(pos);
      }
    }
  }
  return cells;
}

// Проверяет, касается ли точка (hoverX, hoverY) какого-либо корабля на доске.
// export function touchedShip(board: Ship[], cord: Ship): boolean {
//   return !canPlace(board, cord, { id: 0, x: -1, y: -1, w: 0, h: 0, health: 0 });
// }

// Возвращает корабль, который находится в точке (hoverX, hoverY)
export function getWreckedShip(
  board: Ship[],
  cord: ShipCord,
): Ship | undefined {
  return board.find(({ x, y, w, h }) => !shipOverlaps(cord, { x, y, w, h }));
}

//  Удаляет корабль с доски
export function removeShip(board: Ship[], ship: Ship): void {
  const index = board.indexOf(ship);
  board.splice(index, 1);
}

// Поворачивает корабль на доске
export function rotateShip(board: Ship[], ship: Ship): void {
  const copy = Object.assign({}, ship);
  copy.w = ship.h;
  copy.h = ship.w;

  removeShip(board, ship);
  board.push(copy);
}

export function checkShipOverlaps(
  ship1: Ship | ShipCord,
  ship2: Ship | ShipCord,
) {
  // Расширяем зону проверки на 1 клетку во все стороны
  const ship1StartX = ship1.x - 1;
  const ship1StartY = ship1.y - 1;
  const ship1EndX = ship1.x + (ship1.h || 0) + 1;
  const ship1EndY = ship1.y + (ship1.w || 0) + 1;

  const ship2StartX = ship2.x;
  const ship2StartY = ship2.y;
  const ship2EndX = ship2.x + (ship2.h || 0);
  const ship2EndY = ship2.y + (ship2.w || 0);

  // Проверяем пересечение расширенной зоны первого корабля
  // с фактической зоной второго корабля
  return !(
    ship1EndX < ship2StartX ||
    ship1StartX > ship2EndX ||
    ship1EndY < ship2StartY ||
    ship1StartY > ship2EndY
  );
}

export function canPlaceShip(shipPositions: Ship[], ship: Ship): boolean {
  // Проверка выхода за границы доски
  if (outOfBounds([ship.x, ship.y])) {
    return false;
  }

  // Проверка конечной точки корабля
  const endX = ship.x + (ship.h || 0);
  const endY = ship.y + (ship.w || 0);
  if (outOfBounds([endX, endY])) {
    return false;
  }

  // Проверка пересечений с другими кораблями
  for (const placedShip of shipPositions) {
    if (checkShipOverlaps(placedShip, ship)) {
      return false;
    }
  }

  return true;
}

export function placeShipsRandomly(ships: Ship[]): Ship[] {
  const boardSize = 10;
  const maxGlobalAttempts = 100;
  let globalAttempts = 0;

  while (globalAttempts < maxGlobalAttempts) {
    const placedShips: Ship[] = [];
    const shipsToPlace = ships.map((ship) => ({ ...ship }));
    let allShipsPlaced = true;

    for (const ship of shipsToPlace) {
      const length = ship.health;
      let placed = false;
      let placementAttempts = 0;
      const maxPlacementAttempts = 100;

      while (!placed && placementAttempts < maxPlacementAttempts) {
        placementAttempts++;
        const isHorizontal = Math.random() > 0.5;
        const maxX = isHorizontal ? boardSize - 1 : boardSize - length;
        const maxY = isHorizontal ? boardSize - length : boardSize - 1;

        const x = Math.floor(Math.random() * (maxX + 1));
        const y = Math.floor(Math.random() * (maxY + 1));

        const newShip: Ship = {
          ...ship,
          x,
          y,
          w: isHorizontal ? length - 1 : 0,
          h: isHorizontal ? 0 : length - 1,
        };

        if (canPlaceShip(placedShips, newShip)) {
          placedShips.push(newShip);
          placed = true;
        }
      }

      if (!placed) {
        allShipsPlaced = false;
        break;
      }
    }

    if (allShipsPlaced) {
      return placedShips;
    }

    globalAttempts++;
  }

  throw new Error(
    `Не удалось разместить все корабли после ${maxGlobalAttempts} попыток`,
  );
}
