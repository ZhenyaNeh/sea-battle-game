export interface FriendsInfo {
  _id: string;
  nickname: string;
  email: string;
  avatarUrl: string;
  rating: number;
}

export interface FriendShipData {
  _id: string;
  userId: string;
  friendId: string;
  status: string;
}

export type FriendsTabsState = 'friends' | 'search' | 'request';
