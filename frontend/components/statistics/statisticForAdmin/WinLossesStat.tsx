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
import { StatsData } from '@/lib/types/roomTypes';

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

const chartWinLossesConfig = {
  wins: {
    label: 'Wins',
    color: 'hsl(var(--chart-1))',
  },
  losses: {
    label: 'Losses',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

function WinLossesStat() {
  const [winLossesData, setWinLossesData] = useState<StatsData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const resWinLossesByMouth = (
        await UserService.getWinLossStatsLast6Months()
      ).sort((a, b) => {
        if (a.year !== b.year) {
          return a.year - b.year;
        }
        return a.month - b.month;
      });

      const formatteWinLosses = resWinLossesByMouth.map((entry) => ({
        ...entry,
        month: monthNames[entry.month - 1],
      }));

      setWinLossesData(formatteWinLosses);
    };

    fetchData();
  }, []);
  return (
    <div className="w-full  p-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Win/Loss Statistics</CardTitle>
          <CardDescription className="text-1xl">
            Wins and losses in the last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            className="aspect-auto h-[250px] w-full"
            config={chartWinLossesConfig}
          >
            <AreaChart
              accessibilityLayer
              data={winLossesData}
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
                dataKey="wins"
                type="natural"
                fill="var(--color-wins)"
                fillOpacity={0.4}
                stroke="var(--color-wins)"
                stackId="a"
              />
              <Area
                dataKey="losses"
                type="natural"
                fill="var(--color-losses)"
                fillOpacity={0.4}
                stroke="var(--color-losses)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export default WinLossesStat;
