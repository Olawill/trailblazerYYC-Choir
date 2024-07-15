"use client";

import { Header } from "@/components/music/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { faked as fakeData } from "@/data/members/fakeData";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { config } from "../../../middleware";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const chartConfig = {
  views: {
    label: "Amount",
  },
  balance: {
    label: "Balance",
    color: "hsl(var(--chart-1))",
  },
  outstanding: {
    label: "Outstanding",
    color: "hsl(var(--chart-2))",
  },
  expense: {
    label: "Expense",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

const tabLabels = ["line", "bar"];

const FinancePage = () => {
  const [activeChart, setActiveChart] =
    useState<keyof typeof chartConfig>("balance");

  const cleanData = fakeData.map((item, index) => {
    const day = Math.floor(Math.random() * 10) + 1;
    return {
      ...item,
      // Include additional fields if needed
      expense: Math.floor(Math.random() * 100) + 10,
      date:
        day < 10 ? `2024-04-0${day.toString()}` : `2024-04-${day.toString()}`,
    };
  });

  const total = useMemo(
    () => ({
      balance: cleanData.reduce((acc, curr) => acc + curr.amount_paid, 0),
      outstanding: cleanData.reduce((acc, curr) => acc + curr.amount_owing, 0),
      expense: cleanData.reduce((acc, curr) => acc + curr.expense, 0),
    }),
    []
  );

  const formatLabel = (val: string) => {
    return `${val[0].toUpperCase()}${val.slice(1)}`;
  };

  return (
    <div className="h-full">
      <Header label="Financial Summary" />

      <Tabs defaultValue={tabLabels[0]}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value={tabLabels[0]}>
            {formatLabel(tabLabels[0])}
          </TabsTrigger>
          <TabsTrigger value={tabLabels[1]}>
            {formatLabel(tabLabels[1])}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={tabLabels[0]}>
          <Card className="">
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
              <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                <CardTitle>Line Chart - Interactive</CardTitle>
                <CardDescription>
                  <span className="font-bold underline">{fakeData.length}</span>{" "}
                  Total Members
                </CardDescription>
              </div>

              <div className="flex">
                {["balance", "expense", "outstanding"].map((key) => {
                  const chart = key as keyof typeof chartConfig;
                  return (
                    <button
                      key={chart}
                      data-active={activeChart === chart}
                      className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                      onClick={() => setActiveChart(chart)}
                    >
                      <span className="text-xs text-muted-foreground">
                        {chartConfig[chart].label}
                      </span>
                      <span className="text-lg font-bold leading-none sm:text-3xl">
                        <span className="text-sm">$</span>
                        {total[key as keyof typeof total].toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardHeader>

            <CardContent className="px-2 sm:p-6">
              <ChartContainer
                config={chartConfig}
                className="aspect-auto h-[250px] w-full"
              >
                <LineChart
                  accessibilityLayer
                  data={cleanData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        className="w-[150px]"
                        nameKey="views"
                        valueLabel="$"
                        indicator="dot"
                        labelFormatter={(value, payload) => {
                          return new Date(value).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          });
                        }}
                      />
                    }
                  />
                  <Line
                    dataKey={activeChart}
                    type="monotone"
                    stroke={`var(--color-${activeChart})`}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value={tabLabels[1]}>
          <Card>
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
              <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                <CardTitle>Bar Chart - Interactive</CardTitle>
                <CardDescription>
                  <span className="font-bold underline">{fakeData.length}</span>{" "}
                  Total Members
                </CardDescription>
              </div>
              <div className="flex">
                {["balance", "expense", "outstanding"].map((key) => {
                  const chart = key as keyof typeof chartConfig;
                  return (
                    <button
                      key={chart}
                      data-active={activeChart === chart}
                      className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                      onClick={() => setActiveChart(chart)}
                    >
                      <span className="text-xs text-muted-foreground">
                        {chartConfig[chart].label}
                      </span>
                      <span className="text-lg font-bold leading-none sm:text-3xl">
                        <span className="text-sm">$</span>
                        {total[key as keyof typeof total].toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
              <ChartContainer
                config={chartConfig}
                className="aspect-auto h-[250px] w-full"
              >
                <BarChart
                  accessibilityLayer
                  data={cleanData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        className="w-[150px]"
                        nameKey="views"
                        valueLabel="$"
                        labelFormatter={(value) => {
                          return new Date(value).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          });
                        }}
                      />
                    }
                  />
                  <Bar
                    dataKey={activeChart}
                    fill={`var(--color-${activeChart})`}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancePage;
