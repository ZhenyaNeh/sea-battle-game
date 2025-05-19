import { instance } from '@/api/auth.api';
import {
  ResponseLoginUser,
  ResponseUserData,
  UserData,
  UserLoginData,
} from '../types/apiTypes';

export const AuthService = {
  async signUp(userData: UserData): Promise<ResponseUserData | undefined> {
    const { data } = await instance.post<ResponseUserData>('users', userData);
    return data;
  },
  async signIn(
    userData: UserLoginData,
  ): Promise<ResponseLoginUser | undefined> {
    // tokenInstance.remove();
    const { data } = await instance.post<ResponseLoginUser>(
      'auth/login',
      userData,
    );
    return data;
  },
  async getProfile(): Promise<ResponseLoginUser | undefined> {
    const { data } = await instance.get<ResponseLoginUser>('auth/profile');
    if (data) return data;
  },
};
