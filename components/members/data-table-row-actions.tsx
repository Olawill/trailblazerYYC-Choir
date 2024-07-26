"use client";

import { MemberSchema } from "@/schemas";
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
import { statuses } from "@/data/members/data";
import { Loader2, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { changeMemberStatus, deleteMember } from "@/actions/memberUpdate";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NewMemberForm from "@/components/members/new-member/new-member-form";
import { allQuery } from "@/utils/constants";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const status = MemberSchema.parse(row.original);

  const queryClient = useQueryClient();

  const [memberStatus, setMemberStatus] = useState(status.status);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // MEMBER STATUS CHANGE LOGIC
  const { data, mutateAsync: changeStatus } = useMutation({
    mutationFn: (params: { id: string; val: string }) =>
      changeMemberStatus(params.id, params.val),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => allQuery.includes(query.queryKey[0] as string),
      });
    },
  });

  // DELETE MEMBER LOGIC
  const { mutateAsync: DeleteMember } = useMutation({
    mutationFn: (params: { id: string }) => deleteMember(params.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => allQuery.includes(query.queryKey[0] as string),
      });
    },
  });

  const handleClick = async (id: string, val: string) => {
    await changeStatus({ id, val });
  };

  const handleDelete = async (id: string) => {
    await DeleteMember({ id });
  };

  return (
    <AlertDialog open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
            <DialogTrigger asChild>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={memberStatus.toLowerCase()}
                  onValueChange={setMemberStatus}
                >
                  {statuses.map((label) => (
                    <DropdownMenuRadioItem
                      key={label.value}
                      value={label.value}
                      onClick={() => handleClick(status.id, label.value)}
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
              <strong>{status.name}</strong> as a member in the group.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Separator className="mt-4 mb-2" />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 text-white"
              onClick={() => handleDelete(status.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>

        <DialogContent className="bg-white text-grey-500">
          <DialogHeader>
            <DialogTitle className="text-red-500">
              Edit Member Details
            </DialogTitle>
            <DialogDescription>
              Make changes to the member details. Click save when done.
            </DialogDescription>
          </DialogHeader>
          <Separator className="mt-4 mb-2" />
          <NewMemberForm member={status} />

          {/* <DialogFooter>
            <Button
              className="bg-blue-500 text-white"
              onClick={() => handleDelete(status.id)}
            >
              Save
            </Button>
          </DialogFooter> */}
        </DialogContent>
      </Dialog>
    </AlertDialog>
  );
}
