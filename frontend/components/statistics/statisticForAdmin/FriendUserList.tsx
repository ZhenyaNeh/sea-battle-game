import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { UserService } from '@/lib/service/user.service';
import { FriendsInfo } from '@/lib/types/friendTypes';
import { Loader2 } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

interface FriendsListProps {
  userId: string;
}

function FriendsUserList({ userId }: FriendsListProps) {
  // const { socket, isConnected } = useGlobalReq();
  const [friends, setFriends] = useState<FriendsInfo[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getFriends = useCallback(async () => {
    try {
      setLoading(true);
      const dataReq = await UserService.getAllUserFriends(userId);
      setFriends(dataReq || []);
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    getFriends();
  }, [getFriends]);

  if (loading) return <Loader2 className="animate-spin" />;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">User friends</CardTitle>
        <CardDescription className="text-1xl">
          Here you can see all user friends.
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        <ScrollArea className="max-h-[500px] w-full">
          <div className="space-y-4">
            {friends && friends.length === 0 ? (
              <p>No friends found</p>
            ) : (
              friends &&
              friends.map((friend) => (
                <div key={friend._id} className="flex flex-wrap">
                  <div className="w-full flex items-center p-4">
                    <Avatar className="size-15 font-medium text-2xl">
                      <AvatarImage
                        src={UserService.getProfilePhoto(
                          friend?.avatarUrl || '',
                        )}
                      />
                      <AvatarFallback>
                        {friend?.nickname?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 ml-4 items-center">
                      <h3 className="font-medium text-2xl">
                        {friend.nickname}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {friend.email}
                      </p>
                    </div>
                    <div></div>
                  </div>

                  <Separator className="my-2" />
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default FriendsUserList;
