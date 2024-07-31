"use client";

import { admincolumns } from "@/components/admin/admin-columns";
import { usercolumns } from "@/components/admin/user-columns";
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
import { getUsers } from "@/data/members";
import { useCurrentRole } from "@/hooks/use-current-role";
import { UserData } from "@/lib/types";
import { UserRole } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { BeatLoader } from "react-spinners";

const UsersPage = () => {
  const role = useCurrentRole();

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

  const userData =
    users?.map(({ id, name, email, emailVerified, role }) => ({
      id,
      name,
      email,
      verified: emailVerified ? "Yes" : "No",
      role,
    })) ?? [];

  if (isLoading) {
    return (
      <Card className="h-full flex items-center justify-center my-auto bg-transparent border-none shadow-none">
        <BeatLoader size={100} />
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
          User Management Page.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 bg-transparent border-none">
        <Separator className="mb-2" />
        <RoleGate allowedRole={[UserRole.ADMIN]} onPage>
          <DataTable data={userData as UserData[]} columns={usercolumns} />
        </RoleGate>
      </CardContent>
    </Card>
  );
};

export default UsersPage;
