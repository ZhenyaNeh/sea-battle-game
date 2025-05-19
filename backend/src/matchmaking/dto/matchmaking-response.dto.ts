export class MatchmakingResponseDto {
  roomId?: string; // Будет заполнен, если матч найден
  status!: 'searching' | 'matched';
  queue_position?: number; // Позиция в очереди (опционально)
}
