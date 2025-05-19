import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';

class SocketApi {
  private socket: Socket | null = null;
  public sessionId: string;

  constructor() {
    // Получаем sessionId из cookies или создаем новый
    this.sessionId =
      Cookies.get('sessionId') || Math.random().toString(36).substr(2, 9);
    Cookies.set('sessionId', this.sessionId, { expires: 7 }); // Сохраняем sessionId в cookies на 7 дней
  }

  // Подключение к серверу
  public connect(url: string): void {
    this.socket = io(url, {
      query: { sessionId: this.sessionId }, // Передаем sessionId на сервер
    });

    // Обработка успешного подключения
    this.socket.on('connect', () => {
      console.log('[CONNECTED]');
    });

    // Обработка отключения
    this.socket.on('disconnect', (message) => {
      console.log(`[DISCONNECTED] ${message}`);
    });

    // Обработка реконекта
    this.socket.on('reconnect', () => {
      console.log('[RECONNECTED]');
      this.restoreState(); // Восстанавливаем состояние при реконнекте
    });

    // Обработка восстановления состояния
    this.socket.on('stateRestored', (data) => {
      console.log('State restored:', data);
      // Здесь можно обновить состояние игры на клиенте
    });

    // Обработка пользовательских событий
    this.socket.on('customEvent', (data) => {
      console.log('Received custom event:', data);
    });
  }

  // Восстановление состояния
  private restoreState(): void {
    if (this.socket) {
      this.socket.emit('restore-state', { sessionId: this.sessionId });
    }
  }

  // Отправка сообщения на сервер
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public sendMessage(event: string, data: any): void {
    if (this.socket) {
      this.socket.emit(event, data);
    } else {
      console.error('Socket is not connected');
    }
  }

  // Подписка на событие
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public on(event: string, callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    } else {
      console.error('Socket is not connected');
    }
  }

  // Отписка от события
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public off(event: string, callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.off(event, callback); // Используем .off() для отписки
    } else {
      console.error('Socket is not connected');
    }
  }

  // Отключение от сервера
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default SocketApi;
