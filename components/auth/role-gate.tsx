"use client";

import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";
import { FormError } from "@/components/form-error";

type RowGateProp = {
  children: React.ReactNode;
  allowedRole: UserRole;
};

export const RoleGate = ({ children, allowedRole }: RowGateProp) => {
  const role = useCurrentRole();

  if (role !== allowedRole) {
    return (
      <FormError message="You do not have permission to view this content!" />
    );
  }

  return <>{children}</>;
};
