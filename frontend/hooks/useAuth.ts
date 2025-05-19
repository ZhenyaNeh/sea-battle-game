import { useAppSelector } from '@/store/hooks';

interface UserInfo {
  _id: string;
  nickname: string;
  email: string;
  role: string;
  rating: number;
  avatarUrl: string;
  token: string;
}

interface AuthProps {
  isAuth: boolean;
  user: UserInfo | null;
}

export const useAuth = (): AuthProps => {
  const isAuth = useAppSelector((state) => state.user.isAuth);
  const user = useAppSelector((state) => state.user.user);

  return { isAuth, user };
};
