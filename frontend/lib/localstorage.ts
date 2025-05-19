export class LocalStorageManager {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  get(): string {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(this.key);
      return item ? JSON.parse(item) : '';
    }

    return '';
  }

  set(value: string): void {
    try {
      localStorage.setItem(this.key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item ${this.key} to localStorage`, error);
    }
  }

  remove(): void {
    try {
      localStorage.removeItem(this.key);
    } catch (error) {
      console.error(`Error removing item ${this.key} from localStorage`, error);
    }
  }
}
