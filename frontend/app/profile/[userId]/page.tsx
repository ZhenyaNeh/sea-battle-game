'use client';

import FriendsUserList from '@/components/statistics/statisticForAdmin/FriendUserList';
import StatisticUserTabs from '@/components/statistics/statisticForAdmin/StatisticUserTabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserService } from '@/lib/service/user.service';
import { UsersPaginateInfo } from '@/lib/types/playerTypes';
import { AvatarImage } from '@radix-ui/react-avatar';
import { Trophy } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface RoomParams {
  userId: string;
  [key: string]: string | string[] | undefined;
}

function UserProfile() {
  const [user, setUser] = useState<UsersPaginateInfo | null>(null);
  const params = useParams<RoomParams>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await UserService.getPaginatedUsersInfo(params.userId);
      if (response) {
        setUser(response);
      }
    };

    fetchData();
  }, [params.userId]);

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
        </div>
      </div>
      <StatisticUserTabs userId={params.userId} />
      <FriendsUserList userId={params.userId} />
    </div>
  );
}

export default UserProfile;
