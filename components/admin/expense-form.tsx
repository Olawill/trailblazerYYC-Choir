"use client";

import * as z from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExpenseSchema } from "@/schemas";

import {
  Form,
  FormLabel,
  FormField,
  FormItem,
  FormMessage,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { format } from "date-fns";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { useTransition, useState, useEffect } from "react";
import {
  CalendarDays,
  CheckIcon,
  ChevronsUpDown,
  Loader2,
  PlusCircle,
} from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  Command,
  CommandSeparator,
} from "@/components/ui/command";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { useFormStatus } from "react-dom";
import { getExpenseCategories } from "@/data/members";
import { expense } from "@/actions/expense";

interface CategoryProp {
  id: string;
  category: string | null;
}

export const ExpenseForm = () => {
  const [isPending, startTransition] = useTransition();
  const { pending } = useFormStatus();

  const [open, setOpen] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [modalError, setModalError] = useState<string | undefined>("");
  const [modalCategory, setModalCategory] = useState<string | undefined>("");
  const [allCategories, setAllCategories] = useState<CategoryProp[] | null>();

  const form = useForm<z.infer<typeof ExpenseSchema>>({
    resolver: zodResolver(ExpenseSchema),
    defaultValues: {
      amount: 0,
      description: "",
      category: "",
      expenseDate: new Date(),
    },
  });

  useEffect(() => {
    const getCategories = async () => {
      const categories = await getExpenseCategories();

      setAllCategories(categories);
    };

    getCategories();
  }, []);

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModalCategory(e.target.value);
  };

  const onSubmit = (values: z.infer<typeof ExpenseSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      const data = await expense(values);

      try {
        if (data?.error) {
          // form.reset();
          setError(data?.error);
        }

        if (data?.success) {
          form.reset();
          setSuccess(data?.success);
        }

        if (!data) {
          window.location.reload();
        }
      } catch {
        setError("Something went wrong!");
      }
    });
  };

  return (
    <div className="w-full mt-2">
      <h1 className="text-2xl font-semibold text-center border border-gray-500 rounded-md bg-gray-500 text-white p-2 mb-2">
        New Expense Form
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      disabled={isPending}
                      {...field}
                      rows={5}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter description for your expense.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Category</FormLabel>
                  <Dialog
                    open={showNewCategoryModal}
                    onOpenChange={setShowNewCategoryModal}
                  >
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? field.value : "Select a category"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search category..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup>
                              {allCategories &&
                                allCategories?.length > 0 &&
                                allCategories?.map((d) => (
                                  <CommandItem
                                    value={d.category as string}
                                    key={d.id}
                                    onSelect={() => {
                                      form.setValue(
                                        "category",
                                        d.category as string
                                      );
                                      setOpen(false);
                                    }}
                                  >
                                    {d.category}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        d.category === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                          <CommandSeparator />
                          <CommandList>
                            <CommandGroup>
                              <DialogTrigger asChild>
                                <CommandItem
                                  onSelect={() => {
                                    setOpen(false);
                                    setShowNewCategoryModal(true);
                                  }}
                                >
                                  <PlusCircle className="mr-2 h-5 w-5" />
                                  Add Category
                                </CommandItem>
                              </DialogTrigger>
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Category</DialogTitle>
                        <DialogDescription>
                          Add a new category to manage your expenses.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-2">
                        <Label htmlFor="newCategory">New Category</Label>
                        <Input
                          id="newCategory"
                          disabled={pending}
                          value={modalCategory}
                          onChange={handleModalChange}
                          placeholder="New Category name..."
                        />
                        <FormError message={modalError} />
                      </div>

                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setShowNewCategoryModal(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          onClick={() => {
                            if (!modalCategory) {
                              setModalError("Category name cannot be empty.");
                            } else {
                              form.setValue("category", modalCategory);
                              setModalCategory("");
                              setShowNewCategoryModal(false);
                              setModalError("");
                            }
                          }}
                        >
                          {pending ? <Loader2 className="w-4 h-4" /> : "Create"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <FormDescription>
                    Select the category for the expense or create new category.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Amount ($)</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      {...field}
                      step={0.01}
                      min={0}
                      type="number"
                    />
                  </FormControl>
                  <FormDescription>Enter payment amount.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expenseDate"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Expense Date</FormLabel>
                  <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(e) => {
                          field.onChange(e);
                          setOpenCalendar(false);
                        }}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Select the date of the expense.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              "Add Payment"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};
