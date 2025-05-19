'use client';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
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

import React, { useEffect, useState } from 'react';
import { UserService } from '@/lib/service/user.service';
import { GameTypeStatsData } from '@/lib/types/roomTypes';

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

const chartGameTypeConfig = {
  classic: {
    label: 'Classic Sea Battle',
    color: 'hsl(var(--chart-1))',
  },
  event: {
    label: 'Event Mode',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

function GameTypeStat() {
  const [gameTypeData, setGameTypeData] = useState<GameTypeStatsData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const resGameTypeByMouth = (
        await UserService.getGameTypeStatsLast6Months()
      ).sort((a, b) => {
        if (a.year !== b.year) {
          return a.year - b.year;
        }
        return a.month - b.month;
      });

      const formatteGameType = resGameTypeByMouth.map((entry) => ({
        ...entry,
        month: monthNames[entry.month - 1],
      }));

      setGameTypeData(formatteGameType);
    };

    fetchData();
  }, []);

  return (
    <div className="w-full  p-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Game Types Statistics</CardTitle>
          <CardDescription className="text-1xl">
            Games played by type in the last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            className="aspect-auto h-[250px] w-full"
            config={chartGameTypeConfig}
          >
            <AreaChart
              accessibilityLayer
              data={gameTypeData}
              margin={{
                top: 30,
                left: 15,
                right: 15,
              }}
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
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="classicCount"
                type="natural"
                fill="var(--color-classic)"
                fillOpacity={0.4}
                stroke="var(--color-classic)"
                stackId="a"
              />
              <Area
                dataKey="eventCount"
                type="natural"
                fill="var(--color-event)"
                fillOpacity={0.4}
                stroke="var(--color-event)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export default GameTypeStat;
