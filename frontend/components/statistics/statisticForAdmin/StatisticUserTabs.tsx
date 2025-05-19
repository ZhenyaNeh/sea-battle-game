'use client';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  XAxis,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { motion } from 'framer-motion';

import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserService } from '@/lib/service/user.service';
import { StatsData, StatsRatingData } from '@/lib/types/roomTypes';
import { GameHistory } from '@/lib/types/gameTypes';
import { Check, X } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { useRouter } from 'next/navigation';

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const chartConfig = {
  wins: {
    label: 'Wins',
    color: 'hsl(var(--chart-1))',
  },
  losses: {
    label: 'Losses',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

const chartConfigRating = {
  averageRating: {
    label: 'Average Rating',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

interface StatisticUserTabsProps {
  userId: string;
}

function StatisticUserTabs({ userId }: StatisticUserTabsProps) {
  const initialCountGame = {
    allGames: 0,
    winnerGames: 0,
    loseGames: 0,
  };
  const [countGame, setCountGames] = useState<{
    allGames: number;
    winnerGames: number;
    loseGames: number;
  }>(initialCountGame);
  const [gameHistory, setGameHistory] = useState<GameHistory[] | []>([]);
  const [data, setData] = useState<StatsData[]>([]);
  const [dataRating, setDataRating] = useState<StatsRatingData[]>([]);
  // const router = useRouter();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [countData, winLossData, ratingsData, historyData] =
          await Promise.all([
            UserService.getCountUserGames(userId),
            UserService.getMonthlyUserWinLoss(userId),
            UserService.getMonthlyUserAverageRatings(userId),
            UserService.getUserGameHistory(userId),
          ]);

        setCountGames(countData);
        setGameHistory(historyData);

        setData(
          winLossData.map((entry) => ({
            ...entry,
            month: monthNames[entry.month - 1],
          })),
        );

        setDataRating(
          ratingsData.map((entry) => ({
            ...entry,
            month: monthNames[entry.month - 1],
          })),
        );
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
      }
    };

    fetchAllData();
  }, [userId]);

  return (
    <div className="w-full flex justify-start items-center flex-wrap mb-10">
      <h2 className="text-2xl mb-5 font-bold text-left w-full">Statistics</h2>
      <Tabs defaultValue={'game'} className="w-full">
        <TabsList className="w-[300px] grid grid-cols-3">
          <TabsTrigger value="game" className="text-1xl">
            Game
          </TabsTrigger>
          <TabsTrigger
            // onClick={handleSearchClear}
            value="rating"
            className="text-1xl"
          >
            Rating
          </TabsTrigger>
        </TabsList>
        <TabsContent value="game">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Your game statistics</CardTitle>
              <CardDescription className="text-1xl">
                Here you can find all your friends.
              </CardDescription>
            </CardHeader>
            <CardContent className="">
              <div className="flex justify-start items-start h-full max-sm:flex-wrap">
                <Card className="w-full max-w-[350px] h-full">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">
                      Game Statistics
                    </CardTitle>
                    <CardDescription>
                      Your overall performance in all matches
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Games</span>
                      <span className="font-medium">{countGame.allGames}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Wins</span>
                      <span className="font-medium">
                        {countGame.winnerGames}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Losses</span>
                      <span className="font-medium text-muted">
                        {countGame.loseGames}
                      </span>
                    </div>

                    {countGame.allGames > 0 && (
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-muted-foreground">Win Rate</span>
                        <span className="font-medium">
                          {Math.round(
                            (countGame.winnerGames / countGame.allGames) * 100,
                          )}
                          %
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card className="w-full sm:ml-5 max-sm:mt-5">
                  <CardHeader>
                    <CardTitle className="text-xl">
                      Monthly Win/Loss Stats
                    </CardTitle>
                    <CardDescription>
                      Based on the game history for the last 6 months
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={chartConfig}
                      className="aspect-auto h-[200px] w-full"
                    >
                      <BarChart accessibilityLayer data={data}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="month"
                          tickLine={false}
                          tickMargin={10}
                          axisLine={false}
                          tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar
                          dataKey="wins"
                          fill="hsl(var(--chart-1))"
                          radius={4}
                        />
                        <Bar
                          dataKey="losses"
                          fill="hsl(var(--chart-2))"
                          radius={4}
                        />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="rating">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Your rating statistics</CardTitle>
              <CardDescription className="text-1xl">
                Here you can find all your friends.
              </CardDescription>
            </CardHeader>
            <CardContent className="">
              <div className="flex justify-start items-start h-full max-sm:flex-wrap">
                <Card className="w-full max-w-[350px] h-full">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">
                      Recent Matches
                    </CardTitle>
                    <CardDescription>Your last 3 game results</CardDescription>
                  </CardHeader>
                  <CardContent className="flex gap-4 flex-wrap">
                    {gameHistory.map((history, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        className="flex w-full items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full ${history.winner === userId ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                          >
                            {history.winner === userId ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <X className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {history.gameId === 'sea-battle-classic'
                                ? 'Classic'
                                : 'With Events'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Score:{' '}
                              <span className="font-semibold">
                                {history.matchScore}
                              </span>
                            </p>
                          </div>
                        </div>
                        {/* <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground"
                          onClick={() =>
                            router.push(`sea-battle/${history.roomId}`)
                          }
                        >
                          Details
                        </Button> */}
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
                <Card className="w-full sm:ml-5 max-sm:mt-5">
                  <CardHeader>
                    <CardTitle className="text-xl">
                      Monthly rating statistics
                    </CardTitle>
                    <CardDescription>
                      Based on the game history for the last 6 months
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={chartConfigRating}
                      className="aspect-auto h-[200px] w-full"
                    >
                      <LineChart
                        data={dataRating}
                        margin={{ top: 20, left: 12, right: 12 }}
                      >
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="month"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent indicator="line" />}
                        />
                        <Line
                          dataKey="averageRating"
                          type="natural"
                          stroke="var(--color-averageRating)"
                          strokeWidth={2}
                          dot={{ fill: 'var(--color-averageRating)' }}
                          activeDot={{ r: 6 }}
                        >
                          <LabelList
                            position="top"
                            offset={12}
                            className="fill-foreground"
                            fontSize={12}
                          />
                        </Line>
                      </LineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default StatisticUserTabs;
