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
import { faked } from "@/data/members/fakeData";
import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";

const AdminPage = () => {
  const role = useCurrentRole();

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
    <Card className="w-full">
      <CardHeader>
        <p className="text-2xl font-semibold">Manage</p>
        <CardDescription>Manage members status and role here.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 bg-transparent border-none">
        <Separator className="mb-2" />
        <RoleGate allowedRole={UserRole.ADMIN}>
          <DataTable data={fakeData} columns={admincolumns} />
        </RoleGate>
      </CardContent>
    </Card>
  );
};

export default AdminPage;
