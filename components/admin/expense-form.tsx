"use client";

import * as z from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoryModalSchema, ExpenseSchema } from "@/schemas";

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
import { useTransition, useState } from "react";
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

const fakeData = [
  {
    id: "4d458f5b-d298-48d9-a361-dbafd91192c5",
    name: "Music",
  },
  {
    id: "f9a5f900-3f49-487a-ba95-5970679a2fa8",
    name: "Tools",
  },
  {
    id: "b89a697c-2fb3-47b3-9066-8f6bf58ee821",
    name: "Industrial",
  },
  {
    id: "b507b859-fe4f-40dd-a46d-c507f685c457",
    name: "Tools",
  },
  {
    id: "5785f3c6-af8a-4f7e-88f0-39a449623907",
    name: "Jewelry",
  },
  {
    id: "533886a6-944b-46f0-90dc-13a0dfac676a",
    name: "Garden",
  },
  {
    id: "660ce1f3-0254-4066-b5c5-9e5d295d6c68",
    name: "Outdoors",
  },
  {
    id: "7856ca7e-7b60-487f-b87e-e09271787449",
    name: "Tools",
  },
  {
    id: "fc64d076-5cfd-4d60-bfb0-85c674805bb2",
    name: "Toys",
  },
  {
    id: "bebd23d4-ed74-422d-9be7-a0578a4f6be5",
    name: "Movies",
  },
];

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

  const form = useForm<z.infer<typeof ExpenseSchema>>({
    resolver: zodResolver(ExpenseSchema),
    defaultValues: {
      amount: 0,
      description: "",
      category: "",
      expenseDate: new Date(),
    },
  });

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModalCategory(e.target.value);
  };

  const onSubmit = (values: z.infer<typeof ExpenseSchema>) => {
    console.log(values);
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
                              {fakeData.map((d) => (
                                <CommandItem
                                  value={d.name}
                                  key={d.id}
                                  onSelect={() => {
                                    form.setValue("category", d.name);
                                    setOpen(false);
                                  }}
                                >
                                  {d.name}
                                  <CheckIcon
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      d.name === field.value
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
                      step={0.1}
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
