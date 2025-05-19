export class Ship {
  id!: number; // Уникальный идентификатор корабля
  x!: number; // Позиция по оси X
  y!: number; // Позиция по оси Y
  w!: number; // Ширина корабля
  h!: number; // Высота корабля
  health!: number; // Здоровье корабля
}

export interface ShipCord {
  x: number; // Позиция по оси X
  y: number; // Позиция по оси Y
  w: number; // Ширина корабля
  h: number; // Высота корабля
}
