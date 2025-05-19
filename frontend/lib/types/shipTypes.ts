// import SocketApi from '@/api/socket-api';

// export type SocketContextType = {
//   socket: SocketApi | null;
//   connect: (url: string) => void;
//   disconnect: () => void;
// };

export interface Ship {
  id: number; // Уникальный идентификатор корабля
  x: number; // Позиция по оси X
  y: number; // Позиция по оси Y
  w: number; // Ширина корабля
  h: number; // Высота корабля
  health: number; // Здоровье корабля (не используется в данном коде)
}

export interface Hit {
  x: number; // Позиция по оси X
  y: number; // Позиция по оси Y
  hit: boolean; // попадание (да/нет)
}

export interface ShipCord {
  x: number; // Позиция по оси X
  y: number; // Позиция по оси Y
  w: number; // Ширина корабля
  h: number; // Высота корабля
}

export type Cell = [number, number]; // Клетка на поле, представленная как [x, y]

export interface CurrentState {
  target: HTMLElement | null; // DOM-элемент корабля
  x: number; // Начальная позиция по X
  y: number; // Начальная позиция по Y
  ship: Ship; // Данные корабля
  mapX: number; // Координата X на карте
  mapY: number; // Координата Y на карте
}

export type Position = [number, number];
export type ShipPosition = [number, number, number, number]; // [x, y, width, height]
