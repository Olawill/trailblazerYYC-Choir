"use client";

import * as z from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaymentSchema } from "@/schemas";

import {
  Form,
  FormLabel,
  FormField,
  FormItem,
  FormMessage,
  FormControl,
  FormDescription,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { useTransition, useState, useEffect } from "react";
import { CheckIcon, ChevronsUpDown, Loader2 } from "lucide-react";

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
} from "@/components/ui/command";
import { faked as fakeData } from "@/data/members/fakeData";
import { getMembers } from "@/data/members";
import { Member } from "@prisma/client";
import { payment } from "@/actions/expense";

export const PaymentForm = () => {
  const [isPending, startTransition] = useTransition();

  const [open, setOpen] = useState(false);

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const [allMembers, setAllMembers] = useState<Member[] | null>();

  const form = useForm<z.infer<typeof PaymentSchema>>({
    resolver: zodResolver(PaymentSchema),
    defaultValues: {
      amount: 1,
      name: "",
    },
  });

  useEffect(() => {
    const getAllMembers = async () => {
      const members = await getMembers();

      setAllMembers(members);
    };

    getAllMembers();
  }, []);

  const onSubmit = (values: z.infer<typeof PaymentSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      const data = await payment(values);

      try {
        if (data?.error) {
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
        Add New Payment
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Name</FormLabel>
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
                          {field.value ? field.value : "Select a member"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search member..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No member found.</CommandEmpty>
                          <CommandGroup>
                            {allMembers &&
                              allMembers.length > 0 &&
                              allMembers.map((d) => (
                                <CommandItem
                                  value={d.name}
                                  key={d.id}
                                  onSelect={() => {
                                    form.setValue("name", d.name);
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
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <FormDescription>
                    Select the member who made the paymemt.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount ($)</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      {...field}
                      min={1}
                      type="number"
                    />
                  </FormControl>
                  <FormDescription>Enter payment amount.</FormDescription>
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
