'use client';

import { GameStartDialog } from '@/components/dialog/GameStartDialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import React from 'react';

function SeaBattleInfo() {
  const searchParams = useSearchParams();
  const param = searchParams.get('type');

  return (
    <div>
      <h1 className="w-full text-center text-2xl font-bold">Sea Battle</h1>
      <div className="w-full flex justify-between">
        <div className="w-full p-5 flex justify-center items-top flex-wrap">
          <Image
            className="w-[500px] h-[350px] rounded-lg wi"
            src={
              param === 'classic'
                ? '/img/sea-battle.jpg'
                : '/img/sea-battle-event.jpg'
            }
            alt="sea-battle-ship"
            width={500}
            height={200}
          ></Image>
        </div>
        <div className="w-full flex justify-center items-center">
          <Card className="w-full m-5">
            <CardHeader>
              <CardTitle className="text-2xl">
                {' '}
                {param === 'classic'
                  ? 'Sea Battle Game Classic'
                  : 'Sea Battle Game With Events'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardTitle className="mb-1">Description:</CardTitle>
              <CardDescription className="mb-6">
                Sea Battle is a board game for two players in which opponents
                take turns trying to sink each others ships. The game board is a
                10x10 grid, where each player places their ships before the
                battle begins.
              </CardDescription>
              <CardTitle className="mb-1">Rules:</CardTitle>
              <CardDescription>
                <div className="">
                  <ul className="list-decimal p-4">
                    <li>
                      <CardTitle>Ship placement:</CardTitle>
                      <ol className="list-disc p-4">
                        <li>
                          <p>Each player has a fleet of 10 ships:</p>
                          <ol className="list-disc p-4">
                            <li>battleship (4 cells)</li>
                            <li>cruisers (3 cells)</li>
                            <li>destroyers (2 cells)</li>
                            <li>boats (1 cell)</li>
                          </ol>
                        </li>
                        <li>
                          Ships can be placed horizontally or vertically, but
                          not diagonally.
                        </li>
                        <li>
                          There must be at least one empty cell between ships
                          (they cannot touch each other).
                        </li>
                      </ol>
                    </li>
                    <li>
                      <CardTitle>Game Process:</CardTitle>
                      <ol className="list-disc p-4">
                        <li>
                          Players take turns calling out coordinates (for
                          example, A5 or D10).
                        </li>
                        <li>
                          If an opponent ship is on the indicated cell, it is a
                          hit (wounded or killed).
                        </li>
                        <li>If the cell is empty, it is a miss (missed).</li>
                        <li>
                          If a ship is completely destroyed, the player must
                          report it.
                        </li>
                      </ol>
                    </li>
                    <li>
                      <CardTitle>Game objective:</CardTitle>
                      <ol className="list-disc p-4">
                        <li>Be the first to sink all opponent ships.</li>
                      </ol>
                    </li>
                  </ul>
                </div>
              </CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between">
              <GameStartDialog type={param || 'classic'} />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default SeaBattleInfo;
