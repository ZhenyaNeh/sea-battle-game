'use client';

import { tokenInstance } from '@/api/auth.api';
import { CropPhotoDialog } from '@/components/dialog/CropPhotoDialog';
import { EditProfileDialog } from '@/components/dialog/EditProfileDialog';
import FriendTabs from '@/components/friends/FriendTabs';
import AdminStatisticTabs from '@/components/statistics/AdminStatistic';
import StatisticTabs from '@/components/statistics/StatisticTadbs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { UserService } from '@/lib/service/user.service';
import { logout } from '@/store/features/user/userSlice';
import { useAppDispatch } from '@/store/hooks';
import { AvatarImage } from '@radix-ui/react-avatar';
import { Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'sonner';

function Profile() {
  const { user, isAuth } = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const logOutHandler = () => {
    dispatch(logout());
    tokenInstance.remove();
    toast.success('You logged out');
    router.push('/');
    // window.location.reload();
  };

  useEffect(() => {
    if (!isAuth || !user) {
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex justify-center items-center w-full flex-wrap">
      <div className="flex items-center justify-start flex-wrap w-full mb-10">
        <div className="w-full flex justify-start items-start">
          <Avatar className="size-30 text-5xl">
            <AvatarImage
              src={UserService.getProfilePhoto(user?.avatarUrl || '')}
            />
            <AvatarFallback>
              {user?.nickname?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <CropPhotoDialog />
          <div className="flex flex-col justify-start items-start h-full ml-10">
            <h2 className="text-4xl text-primary font-bold">
              {user?.nickname}
            </h2>
            <h2 className="text-1xl text-muted-foreground">{user?.email}</h2>
            <h2 className="text-2xl text-primary mt-5 font-bold flex items-center">
              <p>Rating:</p>
              <p className="ml-3 mr-1">{user?.rating}</p>
              <Trophy strokeWidth={2.8} />
            </h2>
          </div>
          <div className="flex flex-col justify-start items-start h-full ml-10">
            <EditProfileDialog />
            <Button
              className="mt-3"
              variant={'default'}
              onClick={logOutHandler}
            >
              Log out
            </Button>
          </div>
        </div>
      </div>
      {user?.role === 'admin' ? <AdminStatisticTabs /> : <></>}
      <StatisticTabs />
      <FriendTabs />
    </div>
  );
}

export default Profile;
