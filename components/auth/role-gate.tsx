"use client";

import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";
import { FormError } from "@/components/form-error";

type RowGateProp = {
  children: React.ReactNode;
  allowedRole: UserRole;
  showMessage?: boolean;
};

export const RoleGate = ({
  children,
  allowedRole,
  showMessage = true,
}: RowGateProp) => {
  const role = useCurrentRole();

  if (role !== allowedRole) {
    if (showMessage) {
      return (
        <FormError message="You do not have permission to view this content!" />
      );
    }
    return null;
  }

  return <>{children}</>;
};
