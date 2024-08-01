"use client";

import { admincolumns } from "@/components/admin/admin-columns";
import { RoleGate } from "@/components/auth/role-gate";
import { FormError } from "@/components/form-error";
import { DataTable } from "@/components/members/data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getMembers } from "@/data/members";
import { useCurrentRole } from "@/hooks/use-current-role";
import { MemberData } from "@/lib/types";
import { DUE } from "@/utils/constants";
import { amountOwing } from "@/utils/helper";
import { UserRole } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { BeatLoader, PuffLoader } from "react-spinners";

const ManagePage = () => {
  const role = useCurrentRole();

  const { data: members, isLoading } = useQuery({
    queryKey: ["members"],
    queryFn: () => getMembers(),
  });

  const memberData =
    members?.map(({ id, name, email, isActive, amountPaid, dateJoined }) => ({
      id,
      name,
      email,
      status: isActive ? "Active" : "Inactive",
      amount_paid: amountPaid,
      amount_owing: amountOwing(dateJoined, new Date(), amountPaid, DUE),
      joined_since: dateJoined,
    })) ?? [];

  if (isLoading) {
    return (
      <Card className="min-h-full flex items-center justify-center my-auto bg-transparent border-none shadow-none relative">
        <BeatLoader size={100} className="absolute top-[350px]" />
      </Card>
    );
  }

  if (role !== UserRole.ADMIN) {
    return (
      <FormError message="You do not have permission to view this page." />
    );
  }

  return (
    <Card className="w-[350px] bg-transparent sm:w-[550px] md:w-[650px] lg:w-[700px] xl:w-[900px] 2xl:w-[1250px]">
      <CardHeader>
        <p className="text-2xl font-semibold">Manage</p>
        <CardDescription className="text-gray-300">
          Manage members status and role here.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 bg-transparent border-none">
        <Separator className="mb-2" />
        <RoleGate allowedRole={[UserRole.ADMIN]} onPage>
          <DataTable data={memberData as MemberData[]} columns={admincolumns} />
        </RoleGate>
      </CardContent>
    </Card>
  );
};

export default ManagePage;
