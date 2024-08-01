"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { CreditCard, HandCoins } from "lucide-react";
import { OverviewProps } from "@/app/(dashboard)/finance/page";

// const data = [
//   {
//     name: "Jan",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Feb",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Mar",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Apr",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "May",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Jun",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Jul",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Aug",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Sep",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Oct",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Nov",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Dec",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
// ];

const chartConfig = {
  overview: {
    label: "Finance",
  },
  expense: {
    label: "Expense",
    color: "hsl(var(--chart-1))",
    icon: CreditCard,
  },
  payment: {
    label: "Payment",
    color: "hsl(var(--chart-2))",
    icon: HandCoins,
  },
} satisfies ChartConfig;

type OverviewComponentProps = {
  data: OverviewProps[];
};

const Overview = ({ data }: OverviewComponentProps) => {
  return (
    <ResponsiveContainer width="100%" height={450}>
      <ChartContainer config={chartConfig} className="fill-sky-200">
        <BarChart accessibilityLayer data={data}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                className="w-[180px] bg-sky-100 dark:bg-background"
                labelKey="overview"
                valueLabel="$"
              />
            }
            cursor={false}
          />

          <Bar
            dataKey="payment"
            fill="currentColor"
            radius={[4, 4, 0, 0]}
            className="fill-chart-5"
          />
          <Bar
            dataKey="expense"
            // fill="var(--color-expense)"
            radius={[4, 4, 0, 0]}
            className="fill-destructive hover:bg-sky-200"
          />
        </BarChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
};

export default Overview;
