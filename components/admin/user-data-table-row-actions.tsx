"use client";

import { MemberSchema, UserSchema } from "@/schemas";
import { Row } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Roles, statuses } from "@/data/members/data";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import {
  changeMemberStatus,
  changeUserRole,
  deleteMember,
  deleteUser,
} from "@/actions/memberUpdate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NewMemberForm from "@/components/members/new-member/new-member-form";
import { allQuery } from "@/utils/constants";
import { UserRole } from "@prisma/client";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function UserDataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const role = UserSchema.parse(row.original);

  const queryClient = useQueryClient();

  const [userRole, setUserRole] = useState(role.role as string);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  // USER ROLE CHANGE LOGIC
  const { data, mutateAsync: changeRole } = useMutation({
    mutationFn: (params: { id: string; val: "ADMIN" | "USER" | "SUPERUSER" }) =>
      changeUserRole(params.id, params.val),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => allQuery.includes(query.queryKey[0] as string),
      });
    },
  });

  // DELETE MEMBER LOGIC
  const { mutateAsync: DeleteUser } = useMutation({
    mutationFn: (params: { id: string }) => deleteUser(params.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => allQuery.includes(query.queryKey[0] as string),
      });
    },
  });

  const handleClick = async (
    id: string,
    val: "ADMIN" | "USER" | "SUPERUSER"
  ) => {
    await changeRole({ id, val });
  };

  const handleDelete = async (id: string) => {
    await DeleteUser({ id });
  };

  return (
    <AlertDialog open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={userRole.toLowerCase()}
                onValueChange={setUserRole}
              >
                {Roles.map((label) => (
                  <DropdownMenuRadioItem
                    key={label.value}
                    value={label.value}
                    onClick={() => handleClick(role.id, label.label)}
                  >
                    {label.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem>
              Delete
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent className="bg-white text-grey-500">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-500">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <strong>{role.name}</strong> as a user.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Separator className="mt-4 mb-2" />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 text-white"
            onClick={() => handleDelete(role.id)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
