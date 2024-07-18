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
import { getMemberDue, getMembers } from "@/data/members";
import { faked } from "@/data/members/fakeData";
import { useCurrentRole } from "@/hooks/use-current-role";

import { amountOwing } from "@/utils/helper";

import { UserRole } from "@prisma/client";
import { useEffect, useState } from "react";
import { PuffLoader } from "react-spinners";

const AdminPage = () => {
  const role = useCurrentRole();

  const [memberData, setMemberData] = useState<
    MemberData[] | null | undefined
  >();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const due = await getMemberDue();
        const members = await getMembers();

        if (!members || !due) {
          throw new Error("Failed to fetch members or due.");
        }

        const memberData =
          members?.map(
            ({ id, name, email, isActive, amountPaid, dateJoined }) => {
              return {
                id,
                name,
                email,
                status: isActive ? "Active" : "Inactive",
                amount_paid: amountPaid,
                amount_owing: amountOwing(
                  dateJoined,
                  new Date(),
                  amountPaid,
                  due?.amount!
                ),
                joined_since: dateJoined,
              };
            }
          ) ?? [];

        setMemberData(memberData as MemberData[]);
        setIsMounted(true);
      } catch (error) {
        console.error("Error fetching member data:", error);
        setIsMounted(false);
      }
    };

    getData();
  }, []);

  if (!isMounted) {
    return (
      <Card className="h-[90%] flex items-center justify-center my-auto bg-transparent border-none shadow-none">
        <PuffLoader size={250} />
      </Card>
    );
  }

  const fakeData = faked.map((item) => ({
    ...item,
    joined_since: new Date(item.joined_since),
    email: item.email !== null ? item.email : undefined,
  }));

  if (role !== UserRole.ADMIN) {
    return (
      <FormError message="You do not have permission to view this page." />
    );
  }

  return (
    <Card className="w-fit">
      <CardHeader>
        <p className="text-2xl font-semibold">Manage</p>
        <CardDescription>Manage members status and role here.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 bg-transparent border-none">
        <Separator className="mb-2" />
        <RoleGate allowedRole={[UserRole.ADMIN]} onPage>
          <DataTable data={memberData as MemberData[]} columns={admincolumns} />
          {/* <DataTable data={fakeData} columns={admincolumns} /> */}
        </RoleGate>
      </CardContent>
    </Card>
  );
};

export default AdminPage;
