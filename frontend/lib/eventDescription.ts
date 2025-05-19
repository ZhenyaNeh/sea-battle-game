import { TypeOfGameEvents } from './emum';

// const eventDescriptions = {
//   [TypeOfGameEvents.storm]: {
//     icon: '🌀',
//     title: 'Storm Event',
//     description: 'All misses are cleared and ships are relocated!',
//   },
//   [TypeOfGameEvents.rocket]: {
//     icon: '🚀',
//     title: 'Rocket Strike',
//     description: 'Your shot will hit in a cross pattern!',
//   },
//   // ... остальные события
// };

// export const eventDescriptions = {
//   [TypeOfGameEvents.storm]: {
//     icon: '🌀',
//     title: 'Шторм',
//     description: 'Все промахи аннулируются, а корабли перемещаются!',
//   },
//   [TypeOfGameEvents.rocket]: {
//     icon: '🚀',
//     title: 'Ракетный удар',
//     description: 'Выстрел поразит цель крестом (центр + 4 направления)',
//   },
//   [TypeOfGameEvents.brokenWeapon]: {
//     icon: '🔫',
//     title: 'Сломанное орудие',
//     description: '75% шанс, что выстрел уйдёт в случайную соседнюю клетку',
//   },
//   [TypeOfGameEvents.radar]: {
//     icon: '📡',
//     title: 'Радар',
//     description: 'Корабли противника в зоне 3x3 подсвечиваются на 3 секунды',
//   },
//   [TypeOfGameEvents.mine]: {
//     icon: '💣',
//     title: 'Мина',
//     description: '75% шанс, что выстрел попадёт в мину вместо цели',
//   },
//   [TypeOfGameEvents.noEvent]: {
//     icon: '🎯',
//     title: 'Обычный выстрел',
//     description: 'Стандартная механика без особых эффектов',
//   },
//   [TypeOfGameEvents.noSelect]: {
//     icon: '⌛',
//     title: 'Выберите событие',
//     description: 'Нажмите на кубик для выбора случайного события',
//   },
// };

export const eventDescriptions = {
  [TypeOfGameEvents.storm]: {
    icon: '🌀',
    title: 'Storm',
    description: 'All misses are cancelled and ships are moved!',
  },
  [TypeOfGameEvents.rocket]: {
    icon: '🚀',
    title: 'Rocket Strike',
    description:
      'The shot illuminated the target with a cross (center + 4 directions)',
  },
  [TypeOfGameEvents.brokenWeapon]: {
    icon: '🔫',
    title: 'Broken Weapon',
    description: '75% chance that the shot will go to a random adjacent cell',
  },
  [TypeOfGameEvents.radar]: {
    icon: '📡',
    title: 'Radar',
    description: 'Emitting ships in a 3x3 zone are highlighted for 3 seconds',
  },
  [TypeOfGameEvents.mine]: {
    icon: '💣',
    title: 'Mine',
    description:
      '75% chance that the shot will hit the mine instead of the target',
  },
  [TypeOfGameEvents.noEvent]: {
    icon: '🎯',
    title: 'Normal shot',
    description: 'Standard mechanics without special effects',
  },
  [TypeOfGameEvents.noSelect]: {
    icon: '⌛',
    title: 'Select an event',
    description: 'Click the cube to select a random event',
  },
};
