import { Ship, ShipCord } from 'src/matchmaking/dto/ship.dto';
import { Hit } from 'src/rooms/dto/hit.dto';

export function outOfBounds(x, y): boolean {
  return x < 0 || y < 0 || x > 9 || y > 9;
}

// export function shipOverlaps(
//   pos1: Ship | ShipCord,
//   pos2: Ship | ShipCord,
//   i: number = 1,
// ): boolean {
//   return (
//     pos1.y + pos1.w < pos2.y - i ||
//     pos1.x + pos1.h < pos2.x - i ||
//     pos1.y > pos2.y + pos2.w + i ||
//     pos1.x > pos2.x + pos2.h + i
//   );
// }

export function shipOverlaps(ship1: Ship | ShipCord, ship2: Ship | ShipCord) {
  const ship1EndX = ship1.x + ship1.h + 1;
  const ship1EndY = ship1.y + ship1.w + 1;
  const ship2EndX = ship2.x + ship2.h + 1;
  const ship2EndY = ship2.y + ship2.w + 1;

  const noOverlap =
    ship1EndX < ship2.x ||
    ship1.x > ship2EndX ||
    ship1EndY < ship2.y ||
    ship1.y > ship2EndY;

  return !noOverlap;
}

export function shipFireHit(ship: Ship, x: number, y: number): boolean {
  const shipEndX = ship.x + ship.h;
  const shipEndY = ship.y + ship.w;

  if (x >= ship.x && x <= shipEndX && y >= ship.y && y <= shipEndY) {
    return true; // Попадание
  }

  return false; // Промах
}

export function getSurroundingCells(ship: Ship): Hit[] {
  const { x, y, w, h } = ship;
  const minX = x - 1;
  const minY = y - 1;
  const maxX = x + h + 1;
  const maxY = y + w + 1;

  const surroundingCells: Hit[] = [];

  for (let i = minX; i <= maxX; i++) {
    for (let j = minY; j <= maxY; j++) {
      if (!outOfBounds(i, j) && !shipFireHit(ship, i, j)) {
        surroundingCells.push({ x: i, y: j, hit: false });
      }
    }
  }

  return surroundingCells;
}

export function getRadarZone(
  centerX: number,
  centerY: number,
  opponentBoard: Ship[],
): Hit[] {
  const cells: Hit[] = [];

  // Определяем границы зоны 3x3 (с учетом краев поля)
  const newX = Math.max(1, Math.min(8, centerX));
  const newY = Math.max(1, Math.min(8, centerY));

  const startX = Math.max(0, newX - 1);
  const endX = Math.min(9, newX + 1);
  const startY = Math.max(0, newY - 1);
  const endY = Math.min(9, newY + 1);

  // Добавляем все клетки в зоне
  for (let x = startX; x <= endX; x++) {
    for (let y = startY; y <= endY; y++) {
      const hasShip = opponentBoard.find((ship) => shipFireHit(ship, x, y));

      if (hasShip) {
        cells.push({ x, y, hit: true });
      } else {
        cells.push({ x, y, hit: false });
      }
    }
  }

  return cells;
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
