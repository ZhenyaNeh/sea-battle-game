'use client';
import { Area, AreaChart, CartesianGrid, LabelList, XAxis } from 'recharts';
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
import { RegistrationStatsData } from '@/lib/types/roomTypes';

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

const chartRegistrationConfig = {
  count: {
    label: 'Registrations',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

function RegistrationStat() {
  const [registrationData, setRegistrationData] = useState<
    RegistrationStatsData[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const resRegistrationUsersByMouth = (
        await UserService.getRegistrationStatsLast6Months()
      ).sort((a, b) => {
        if (a.year !== b.year) {
          return a.year - b.year;
        }
        return a.month - b.month;
      });

      const formattedRegistrations = resRegistrationUsersByMouth.map(
        (entry) => ({
          ...entry,
          month: monthNames[entry.month - 1],
        }),
      );

      setRegistrationData(formattedRegistrations);
    };

    fetchData();
  }, []);

  return (
    <div className="w-full p-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">User Registrations</CardTitle>
          <CardDescription className="text-1xl">
            New users registered in the last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            className="aspect-auto h-[250px] w-full"
            config={chartRegistrationConfig}
          >
            <AreaChart
              accessibilityLayer
              data={registrationData}
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
                dataKey="count"
                type="natural"
                fill="hsl(var(--chart-1))"
                fillOpacity={0.4}
                stroke="hsl(var(--chart-1))"
              >
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Area>
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export default RegistrationStat;
