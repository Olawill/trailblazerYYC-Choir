"use client";

import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";
import { FormError } from "@/components/form-error";

type RowGateProp = {
  children: React.ReactNode;
  allowedRole: UserRole[];
  showMessage?: boolean;
  onPage?: boolean;
};

export const RoleGate = ({
  children,
  allowedRole,
  showMessage = true,
  onPage = false,
}: RowGateProp) => {
  const role = useCurrentRole();

  if (!allowedRole.includes(role!)) {
    if (showMessage) {
      return (
        <FormError
          message="You do not have permission to view this content!"
          forPage={onPage}
        />
      );
    }
    return null;
  }

  return <>{children}</>;
};
