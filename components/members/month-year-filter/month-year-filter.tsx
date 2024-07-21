import { Column } from "@tanstack/react-table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { CheckIcon, PlusCircle } from "lucide-react";
import { months } from "@/data/members/data";
import { unwatchFile } from "fs";

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

export function MonthYearFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as Date[]);

  const getMonthsInTable = (mappedData: Map<any, number>, label: string) => {
    let monthsInTable: string[] = [];
    if (mappedData) {
      const obj = Object.fromEntries(mappedData);
      monthsInTable = Object.keys(obj).map((key) =>
        new Date(key).toLocaleString("default", { month: "short" })
      );
    }

    const uniqueMonths = Array.from(new Set(monthsInTable));

    return uniqueMonths.includes(label);
  };

  function hasDateWithSameMonth(
    selectedValues: Set<Date>,
    monthLabel: string
  ): boolean {
    return Array.from(selectedValues).some((date) =>
      isSameMonth(date, monthLabel)
    );
  }

  // Custom comparison function to check if a date has the same month as a given label
  function isSameMonth(date: Date, monthLabel: string): boolean {
    const month = date.toLocaleString("default", { month: "short" });
    return month === monthLabel;
  }

  const getUniqueSelectedValues = (selectedValues: Set<Date>): Set<string> => {
    const selectedValuesArray = Array.from(selectedValues);
    const uniqueArray: string[] = [];

    selectedValuesArray.forEach((item) => {
      const itemMonth = new Date(item).toLocaleString("default", {
        month: "short",
      });
      if (!uniqueArray.includes(itemMonth)) {
        uniqueArray.push(itemMonth);
      }
    });

    return new Set(uniqueArray);
  };

  const getOptionLabel = (
    facets: Map<any, number> | undefined,
    label: string
  ) => {
    let count = 0;

    // console.log(facets.);
    facets?.forEach((value, key) => {
      if (
        new Date(key).toLocaleString("default", { month: "short" }) === label
      ) {
        count += 1;
      }
    });

    return count;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle className="mr-2 h-4 w-4" />
          {title}
          {getUniqueSelectedValues(selectedValues)?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {getUniqueSelectedValues(selectedValues).size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {getUniqueSelectedValues(selectedValues).size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {getUniqueSelectedValues(selectedValues).size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) =>
                      hasDateWithSameMonth(selectedValues, option.label)
                    )
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.label}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = hasDateWithSameMonth(
                  selectedValues,
                  option.label
                );

                const monthsIntable = getMonthsInTable(
                  facets as Map<any, number>,
                  option.label
                );

                if (!monthsIntable) {
                  return null;
                }

                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        const datesToRemove: Date[] = [];
                        selectedValues.forEach((date) => {
                          if (isSameMonth(date, option.label)) {
                            datesToRemove.push(date);
                          }
                        });

                        datesToRemove.forEach((date) =>
                          selectedValues.delete(date)
                        );
                      } else {
                        const datesToAdd: Date[] = [];
                        facets?.forEach((value, key) => {
                          if (isSameMonth(key, option.label)) {
                            datesToAdd.push(key);
                          }
                        });
                        datesToAdd.forEach((date) => selectedValues.add(date));
                      }

                      const filterValues = Array.from(selectedValues);
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      );
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className={cn("h-4 w-4")} />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                    {getOptionLabel(facets, option.label) > 0 && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {getOptionLabel(facets, option.label)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
