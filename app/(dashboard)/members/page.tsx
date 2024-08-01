"use client";

import { RoleGate } from "@/components/auth/role-gate";
import { columns } from "@/components/members/columns";
import { DataTable } from "@/components/members/data-table";
import { Header } from "@/components/music/header";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getMembers } from "@/data/members";
import { MemberData } from "@/lib/types";
import { DUE } from "@/utils/constants";
import { amountOwing } from "@/utils/helper";
import { UserRole } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Suspense } from "react";
import { BeatLoader } from "react-spinners";

const MembersPage = () => {
  const qC = useQueryClient();

  const { data: members, isLoading } = useQuery({
    queryKey: ["members"],
    queryFn: () => getMembers(),
  });

  const memberData =
    members?.map(({ id, name, email, isActive, amountPaid, dateJoined }) => {
      return {
        id,
        name,
        email,
        status: isActive ? "Active" : "Inactive",
        amount_paid: amountPaid,
        amount_owing: amountOwing(dateJoined, new Date(), amountPaid, DUE),
        joined_since: dateJoined,
      };
    }) ?? [];

  if (isLoading) {
    return (
      <Card className="h-full flex items-center justify-center my-auto bg-transparent border-none shadow-none relative">
        <BeatLoader size={100} className="absolute top-[350px]" />
      </Card>
    );
  }

  return (
    <RoleGate allowedRole={[UserRole.SUPERUSER, UserRole.ADMIN]} onPage>
      <Suspense fallback={<MembersPage.Skeleton />}>
        <div className="h-full w-[350px] sm:w-[600px] md:w-[650px] lg:w-[700px] xl:w-[900px] 2xl:w-[1250px]">
          <Header label="Members" action="Add" />

          <div className="h-full flex-1 flex-col space-y-8 p-2 md:flex">
            <div className="flex items-center justify-between space-y-2">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Welcome back!
                </h2>
                <p className="text-gray-300">
                  Here&apos;s a list of all members in the group!
                </p>
              </div>
            </div>
            <DataTable
              data={memberData as MemberData[]}
              columns={columns}
              showRowsSelected={false}
            />
          </div>
        </div>
      </Suspense>
    </RoleGate>
  );
};

export default MembersPage;

MembersPage.Skeleton = function MembersPageSkeleton() {
  return (
    <div className="mt-2 h-full w-[350px] sm:w-[600px] md:w-[650px] lg:w-[700px] xl:w-[900px] 2xl:w-[1250px]">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-48 bg-gray-500" />
        <Skeleton className="h-10 w-32 bg-gray-500" />
      </div>
      <Skeleton className="w-full h-1 my-6 bg-gray-500" />

      <Skeleton className="h-10 w-60 bg-gray-500 mb-2" />
      <Skeleton className="h-4 w-72 bg-gray-500 mb-6" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <Skeleton className="h-8 w-32 bg-gray-500" />
          <Skeleton className="h-8 w-52 bg-gray-500" />
          <Skeleton className="h-8 w-32 bg-gray-500" />
          <Skeleton className="h-8 w-32 bg-gray-500" />
        </div>
        <Skeleton className="h-8 w-28 bg-gray-500 self-start" />
      </div>

      <Skeleton className="bg-gray-500 min-h-[750px] w-full" />
    </div>
  );
};
