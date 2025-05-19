import { LocalStorageManager } from '@/lib/localstorage';
import axios from 'axios';

export const tokenInstance = new LocalStorageManager('auth-token');

export const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000/',
  // headers: {
  //   Authorization: `Bearer ${tokenInstance.get()}`,
  // },
});

instance.interceptors.request.use((config) => {
  const token = tokenInstance.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
