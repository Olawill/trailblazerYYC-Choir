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
import { amountOwing } from "@/utils/helper";
import { UserRole } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { PuffLoader } from "react-spinners";

const DUE = 10;

const ManagePage = () => {
  const role = useCurrentRole();

  const {
    data: members,
    isLoading,
    error,
    refetch,
  } = useQuery({ queryKey: ["members"], queryFn: () => getMembers() });
  // const { data: due } = useQuery({
  //   queryKey: ["due"],
  //   queryFn: () => getMemberDue(),
  // });

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
      <Card className="h-full flex items-center justify-center my-auto bg-transparent border-none shadow-none">
        <PuffLoader size={250} />
      </Card>
    );
  }

  if (role !== UserRole.ADMIN) {
    return (
      <FormError message="You do not have permission to view this page." />
    );
  }

  return (
    <Card className="w-fit bg-transparent">
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
