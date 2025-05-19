'use client';

import FriendTabs from '@/components/friends/FriendTabs';
import { FriendsTabsState } from '@/lib/types/friendTypes';
import { useSearchParams } from 'next/navigation';
import React from 'react';

function FriendsPage() {
  const searchParams = useSearchParams();
  const searchParam = searchParams.get('param');

  let searchParamReq = 'friends';

  if (
    searchParam &&
    ['search', 'friends', 'request'].includes(searchParam as string)
  ) {
    searchParamReq = searchParam;
  }

  return (
    <div className="w-full flex justify-center items-center">
      <FriendTabs initialFriendState={searchParamReq as FriendsTabsState} />
    </div>
  );
}

export default FriendsPage;
