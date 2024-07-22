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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoleGate } from "@/components/auth/role-gate";
import { UserRole } from "@prisma/client";
import TotalRevenue from "@/components/finance/total-revenue";
import TotalExpense from "@/components/finance/total-expense";
import TotalMembers from "@/components/finance/total-members";
import ActiveMembers from "@/components/finance/active-members";
import Overview from "@/components/finance/overview";
import RecentActivity from "@/components/finance/recent-activity";

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
  // const [activeChart, setActiveChart] =
  //   useState<keyof typeof chartConfig>("balance");

  // const cleanData = fakeData.map((item, index) => {
  //   const day = Math.floor(Math.random() * 10) + 1;
  //   return {
  //     ...item,
  //     // Include additional fields if needed
  //     expense: Math.floor(Math.random() * 100) + 10,
  //     date:
  //       day < 10 ? `2024-04-0${day.toString()}` : `2024-04-${day.toString()}`,
  //   };
  // });

  // const total = useMemo(
  //   () => ({
  //     balance: cleanData.reduce((acc, curr) => acc + curr.amount_paid, 0),
  //     outstanding: cleanData.reduce((acc, curr) => acc + curr.amount_owing, 0),
  //     expense: cleanData.reduce((acc, curr) => acc + curr.expense, 0),
  //   }),
  //   []
  // );

  // const formatLabel = (val: string) => {
  //   return `${val[0].toUpperCase()}${val.slice(1)}`;
  // };

  return (
    <RoleGate allowedRole={[UserRole.SUPERUSER, UserRole.ADMIN]} onPage>
      <div className="h-full w-[450px] sm:w-[600px] md:w-[650px] lg:w-[700px] xl:w-[900px] 2xl:w-[1250px]">
        <Header label="Financial Summary" />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
          <TotalRevenue />
          <TotalExpense />
          <TotalMembers />
          <ActiveMembers />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 bg-sky-200">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview />
            </CardContent>
          </Card>

          <Card className="col-span-3 bg-sky-200">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>You made 265 sales this month.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivity />
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGate>
  );
};

export default FinancePage;
