'use client';

import React from 'react';
import RegistrationStat from './statisticForAdmin/RegistrationStat';
import ComplitedGameStat from './statisticForAdmin/ComplitedGameStat';
import WinLossesStat from './statisticForAdmin/WinLossesStat';
import GameTypeStat from './statisticForAdmin/GameTypeStat';
import UsersTable from './statisticForAdmin/UsersTable';
import UnfinishedGame from './statisticForAdmin/UnfinishedGames';

function AdminStatisticTabs() {
  return (
    <div className="w-full flex justify-start items-center flex-wrap mb-10">
      <h2 className="text-2xl mb-5 font-bold text-left w-full">
        Statistics for administrator
      </h2>
      <div className="w-full grid grid-cols-4"></div>
      <div className="w-full flex max-sm:flex-wrap">
        <RegistrationStat />
        <ComplitedGameStat />
      </div>
      <div className="w-full flex max-sm:flex-wrap">
        <WinLossesStat />
        <GameTypeStat />
      </div>
      <h2 className="text-2xl mb-5 mt-10 font-bold text-left w-full">
        All registered users
      </h2>
      <UsersTable />
      <h2 className="text-2xl mb-5 mt-10 font-bold text-left w-full">
        All unfinished game
      </h2>
      <UnfinishedGame />
    </div>
  );
}

export default AdminStatisticTabs;
