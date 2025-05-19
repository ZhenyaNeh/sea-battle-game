import { TypeOfFriendList } from '@/lib/emum';
import { UserService } from '@/lib/service/user.service';
import { FriendShipData, FriendsInfo } from '@/lib/types/friendTypes';
import { Loader2, UserMinus2, UserPlus2 } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { useGlobalReq } from '@/app/sea-battle/context/GlobalRequestContext';
import { toast } from 'sonner';
import { InviteDialog } from '../dialog/InviteDilog';
import { useAuth } from '@/hooks/useAuth';

interface FriendsListProps {
  typeOfList: TypeOfFriendList;
  searchString?: string;
  gameId?: string;
}

function FriendsList({ typeOfList, searchString = '' }: FriendsListProps) {
  const { user } = useAuth();
  const { socket, isConnected } = useGlobalReq();
  const [friends, setFriends] = useState<FriendsInfo[] | null>(null);
  const [loading, setLoading] = useState(true);
  const friendShips = useRef<FriendShipData[] | null>(null);

  const getFriends = useCallback(async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      let dataReq: FriendsInfo[] = [];

      if (typeOfList === TypeOfFriendList.friends) {
        dataReq = await UserService.getAllFriends();
      } else if (typeOfList === TypeOfFriendList.request) {
        dataReq = await UserService.getAllFriendsRequest();
      } else if (typeOfList === TypeOfFriendList.search) {
        dataReq = await UserService.getFriendsSearch(searchString);
        friendShips.current = await UserService.getAllFriendShips();
      }

      setFriends(dataReq || []);
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setLoading(false);
    }
  }, [typeOfList, searchString, user?._id]);

  useEffect(() => {
    getFriends();
  }, [typeOfList, searchString, getFriends]);

  const handleRequest = async (friendId: string) => {
    if (socket && isConnected) {
      socket.emit('/friendRequest', { friendId });
    }
    getFriends();
  };

  const handleAcceptRequest = async (friendId: string) => {
    if (socket && isConnected) {
      socket.emit('/friendAccept', { friendId });
    }
    getFriends();
  };

  const handleRejectRequest = async (friendId: string) => {
    if (socket && isConnected) {
      socket.emit('/friendReject', { friendId });
    }
    getFriends();
  };

  const handleRemoveFriendShip = async (friendId: string) => {
    // if (socket && isConnected) {
    // socket.emit('/friendReject', { friendId });
    // }
    const data = await UserService.deleteFriend(friendId);
    if (data.message === 'success') {
      toast.success('Friend deleted');
    }
    getFriends();
  };

  if (loading) return <Loader2 className="animate-spin" />;

  return (
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
                    src={UserService.getProfilePhoto(friend?.avatarUrl || '')}
                  />
                  <AvatarFallback>
                    {friend?.nickname?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 ml-4 items-center">
                  <h3 className="font-medium text-2xl">{friend.nickname}</h3>
                  <p className="text-sm text-muted-foreground">
                    {friend.email}
                  </p>
                </div>
                <div>
                  {typeOfList === TypeOfFriendList.friends && (
                    <div className="space-x-2 flex justify-center items-center">
                      <InviteDialog friendId={friend._id} />
                      <Button
                        onClick={() => handleRemoveFriendShip(friend._id)}
                      >
                        <UserMinus2 />
                      </Button>
                    </div>
                  )}
                  {typeOfList === TypeOfFriendList.request && (
                    <div className="space-x-2 flex justify-center items-center">
                      <Button onClick={() => handleAcceptRequest(friend._id)}>
                        <UserPlus2 />
                      </Button>
                      <Button onClick={() => handleRejectRequest(friend._id)}>
                        <UserMinus2 />
                      </Button>
                    </div>
                  )}
                  {typeOfList === TypeOfFriendList.search &&
                    (friendShips.current &&
                    friendShips.current.find(
                      (user) =>
                        (user.friendId === friend._id ||
                          user.userId === friend._id) &&
                        user.status === 'accepted',
                    ) ? (
                      <h2 className="font-medium">Your friend</h2>
                    ) : (
                      <Button onClick={() => handleRequest(friend._id)}>
                        <UserPlus2 />
                      </Button>
                    ))}
                </div>
              </div>

              <Separator className="my-2" />
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );
}

export default FriendsList;
