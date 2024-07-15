"use client";

import { Member } from "@/schemas";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/members/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { labels, statuses } from "@/data/members/data";
import { DataTableRowActions } from "@/components/members/data-table-row-actions";
import { RoleGate } from "../auth/role-gate";
import { UserRole } from "@prisma/client";

// Format the amount as a dollar amount
const formatted = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
});

export const columns: ColumnDef<Member>[] = [
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
      const label = labels.find((label) => label.value === row.original.email);

      return (
        <div className="flex space-x-2">
          {label && <Badge variant="outline">{label.label}</Badge>}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("email")}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const rowValue = row.getValue("status") as string;
      const status = statuses.find(
        (status) => status.value.toLowerCase() === rowValue?.toLowerCase()
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon
              className={`mr-2 h-4 w-4 ${
                status.value === "active" ? "text-emerald-500" : "text-red-500"
              }`}
            />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "joined_since",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Member Since" />
    ),
    cell: ({ row }) => {
      const formatDate = (t: Date) => {
        return t.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        });
      };

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {formatDate(row.getValue("joined_since"))}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "amount_paid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Paid" />
    ),
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === "amount_paid");

      const amount = parseFloat(row.getValue("amount_paid"));

      return (
        <div className="flex space-x-2">
          {label && <Badge variant="success">{label.label}</Badge>}
          <span className="max-w-[500px] truncate font-medium">
            {formatted.format(amount)}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "amount_owing",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Outstanding" />
    ),
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === "amount_owing");

      const amount = parseFloat(row.getValue("amount_owing"));

      return (
        <div className="flex space-x-2">
          {label && <Badge variant="destructive">{label.label}</Badge>}
          <span className="max-w-[500px] truncate font-medium">
            {formatted.format(amount)}
          </span>
        </div>
      );
    },
  },
];
