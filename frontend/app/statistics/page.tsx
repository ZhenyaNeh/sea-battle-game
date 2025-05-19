'use client';

import StatisticTabs from '@/components/statistics/StatisticTadbs';
import React from 'react';

function StatisticsPage() {
  //   const searchParams = useSearchParams();
  //   const param = searchParams.get('param'); // 'search'
  //   let paramReq = 'friends';
  //   console.log(param);

  //   if (param && ['search', 'friends', 'request'].includes(param as string)) {
  //     paramReq = param;
  //   }

  // useEffect(() => {
  //   if (!isAuth || !user) {
  //     router.push('/auth');
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <div className="w-full flex justify-center items-center">
      {/* <FriendTabs initialFriendState={paramReq as FriendsTabsState} /> */}
      {/* {!isAuth ? (
        <div className="flex justify-center items-center flex-wrap">
          <h2 className="w-full text-4xl text-center">You are not logged in</h2>
          <Button className="w-[120px] h-[50px] text-4xl text-center mt-20">
            <Link href="/auth">Sign in</Link>
          </Button>
        </div>
      ) : ( */}
      <StatisticTabs />
      {/* )} */}
    </div>
  );
}

export default StatisticsPage;
