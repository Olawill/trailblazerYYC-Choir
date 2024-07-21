"use client";

import { Row, Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { DataTableViewOptions } from "@/components/members/data-table-view-options";
import { DataTableFacetedFilter } from "@/components/members/data-table-faceted-filter";
import { months, statuses } from "@/data/members/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { MonthYearFilter } from "./month-year-filter/month-year-filter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMember } from "@/actions/memberUpdate";
import { MemberSchema } from "@/schemas";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const queryClient = useQueryClient();

  const isFiltered = table.getState().columnFilters.length > 0;

  const [filterValue, setFilterValue] = useState("name");

  // DELETE MEMBER LOGIC
  const { mutateAsync: DeleteMember } = useMutation({
    mutationFn: (params: { id: string }) => deleteMember(params.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });

  const handleDelete = async (id: string) => {
    await DeleteMember({ id });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Select onValueChange={setFilterValue}>
          <SelectTrigger className="w-[120px] h-8">
            <SelectValue placeholder="Filter By: " />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="email">Email</SelectItem>
          </SelectContent>
        </Select>

        {filterValue === "name" ? (
          <Input
            placeholder="Filter name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        ) : (
          <Input
            placeholder="Filter email..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}

        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}

        {table.getColumn("joined_since") && (
          <MonthYearFilter
            column={table.getColumn("joined_since")}
            title="Month"
            options={months}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex gap-2 flex-col-reverse flex-wrap md:flex-row self-start">
        {table.getSelectedRowModel().rows.length >= 2 && (
          <Button
            variant="destructive"
            size="sm"
            className="h-8 font-bold self-start"
            onClick={() => {
              table.getSelectedRowModel().rows.map((row) => {
                const rowData = MemberSchema.parse(row.original);
                handleDelete(rowData.id);
              });
            }}
          >
            Bulk Delete
          </Button>
        )}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
