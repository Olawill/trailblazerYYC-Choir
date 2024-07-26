"use client";

import { Header } from "@/components/music/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { RoleGate } from "@/components/auth/role-gate";
import { UserRole } from "@prisma/client";
import TotalRevenue from "@/components/finance/total-revenue";
import TotalExpense from "@/components/finance/total-expense";
import TotalMembers from "@/components/finance/total-members";
import ActiveMembers from "@/components/finance/active-members";
import Overview from "@/components/finance/overview";
import RecentActivity from "@/components/finance/recent-activity";
import { useQuery } from "@tanstack/react-query";
import { recentActivity } from "@/actions/finance";
import { BeatLoader } from "react-spinners";
import { DatePickerWithRange } from "@/components/finance/date-picker";

export type RecentActivityProps = {
  amount: number;
  date: Date;
  title: string;
  description: string;
  type: string;
};

export type OverviewProps = {
  name: string;
  payment: number;
  expense: number;
};

const FinancePage = () => {
  const allData: RecentActivityProps[] = [];
  const overviewData: Record<string, OverviewProps> = {};

  const { data: recentActivityData, isLoading: recentActivityLoading } =
    useQuery({
      queryKey: ["recentActivity"],
      queryFn: () => recentActivity(),
    });

  if (recentActivityData) {
    recentActivityData?.expenseData?.forEach(
      ({ amount, expenseDate, category, description }) => {
        return allData.push({
          amount,
          date: expenseDate,
          title: category as string,
          description: description as string,
          type: "expense",
        });
      }
    );

    recentActivityData?.paymentData?.forEach(
      ({ amount, paymentDate, member }) => {
        return allData.push({
          amount,
          date: paymentDate,
          title: member.name,
          description: member.email as string,
          type: "payment",
        });
      }
    );

    allData
      .sort((a, b) => new Date(a.date).getMonth() - new Date(b.date).getMonth())
      .forEach((item) => {
        let monthName = item.date.toLocaleString("default", { month: "short" });

        if (!overviewData[monthName]) {
          overviewData[monthName] = { name: monthName, payment: 0, expense: 0 };
        }

        if (item.type === "payment") {
          overviewData[monthName].payment += item.amount;
        } else if (item.type === "expense") {
          overviewData[monthName].expense += item.amount;
        }
      });
  }

  return (
    <RoleGate allowedRole={[UserRole.SUPERUSER, UserRole.ADMIN]} onPage>
      <div className="h-full w-[350px] sm:w-[600px] md:w-[650px] lg:w-[700px] xl:w-[900px] 2xl:w-[1250px]">
        <Header label="Financial Summary" />

        <DatePickerWithRange />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
          <TotalRevenue />
          <TotalExpense />
          <TotalMembers />
          <ActiveMembers />
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-7">
          <Card className="col-span-4 bg-sky-200">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              {recentActivityLoading ? (
                <div className="flex justify-center items-center">
                  <BeatLoader size={50} />
                </div>
              ) : (
                <Overview data={Object.values(overviewData)} />
              )}
            </CardContent>
          </Card>

          <Card className="col-span-4 lg:col-span-3 bg-sky-200">
            <CardHeader className="p-6 pl-2">
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                You have {recentActivityData?.numberOfActivity || 0} activity
                this month.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0">
              {recentActivityLoading ? (
                <div className="flex justify-center items-center">
                  <BeatLoader size={50} />
                </div>
              ) : (
                <RecentActivity data={allData} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGate>
  );
};

export default FinancePage;
