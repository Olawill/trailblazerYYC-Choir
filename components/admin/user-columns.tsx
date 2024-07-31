"use client";

import { Member } from "@/schemas";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/members/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { labels, statuses } from "@/data/members/data";
import { DataTableRowActions } from "@/components/members/data-table-row-actions";
import { RoleGate } from "../auth/role-gate";
import { User, UserRole } from "@prisma/client";
import { UserData } from "@/lib/types";
import { CheckCheck, X } from "lucide-react";
import { UserDataTableRowActions } from "./user-data-table-row-actions";

export const usercolumns: ColumnDef<UserData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.name);

      return (
        <div className="flex space-x-2">
          {label && <Badge variant="outline">{label.label}</Badge>}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name")}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const email = row.original.email || "";
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">{email}</span>
        </div>
      );
    },
  },

  {
    accessorKey: "verified",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Verified" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          {row.original.verified === "Yes" ? (
            <Badge variant="success">
              <CheckCheck className="w-4 h-4" />
            </Badge>
          ) : (
            <Badge variant="destructive">
              <X className="w-4 h-4" />
            </Badge>
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.original.role}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    id: "actions",
    cell: ({ row }) => (
      <RoleGate allowedRole={[UserRole.ADMIN]} showMessage={false}>
        {" "}
        <UserDataTableRowActions key={row.original.id} row={row} />
      </RoleGate>
    ),
  },
];
