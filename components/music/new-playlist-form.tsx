"use client";

import { useState, useTransition } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { NewPlaylistSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckIcon, ChevronsUpDown, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Playlist } from "@prisma/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Checkbox } from "../ui/checkbox";

export const NewPlaylistForm = () => {
  const queryClient = useQueryClient();

  const [isPending, startTransition] = useTransition();

  const [open, setOpen] = useState(false);
  const [listName, setListName] = useState<string[]>([]);

  const [music, setMusic] = useState([
    { id: "1", name: "Recently Added", canAddTo: false },
    { id: "2", name: "Recently Played", canAddTo: false },
    { id: "3", name: "Top Songs", canAddTo: false },
    { id: "4", name: "Aug 2024 Concert", canAddTo: true },
    { id: "5", name: "Sunday Aug 4, 2024", canAddTo: true },
  ]);

  const form = useForm<z.infer<typeof NewPlaylistSchema>>({
    resolver: zodResolver(NewPlaylistSchema),
    defaultValues: {
      name: "",
      musicIds: [],
      canAddTo: "no",
    },
  });

  const onSubmit = (values: z.infer<typeof NewPlaylistSchema>) => {
    console.log(values);
  };

  const handleKeyPress = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") e.preventDefault();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    {...field}
                    placeholder="Playlist Name"
                    type="text"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="canAddTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Generic Group</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  defaultValue={field.value}
                  value={field.value}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select whether the playlist is generic or not" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="musicIds"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Music(s)</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        disabled={isPending}
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value.length > 0
                          ? listName.join(", ")
                          : "Select playlist(s)"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder="Select playlist(s)"
                        className="h-9"
                      />
                      <CommandList>
                        {music.length === 0 && (
                          <CommandEmpty>No results found.</CommandEmpty>
                        )}
                        <CommandGroup>
                          {music &&
                            music.length > 0 &&
                            music.map((d) => (
                              <CommandItem
                                value={d.name}
                                key={d.id}
                                // onSelect={() => {
                                //   form.setValue("musicIds", d.name);
                                //   setOpen(false);
                                // }}
                                className="w-full"
                              >
                                <Checkbox
                                  checked={field.value?.includes(d.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      // When the checkbox is checked
                                      field.onChange([...field.value, d.id]);
                                      setListName((prev) => [...prev, d.name]);
                                    } else {
                                      // When the checkbox is unchecked
                                      field.onChange(
                                        field.value?.filter(
                                          (value) => value !== d.id
                                        )
                                      );
                                      setListName((prev) =>
                                        prev.filter((name) => name !== d.name)
                                      );
                                    }
                                  }}
                                />
                                <FormLabel className="ml-2">{d.name}</FormLabel>
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button disabled={isPending} type="submit" className="w-full">
          {isPending ? (
            <Loader2 className="animate-spin h-4 w-4" />
          ) : (
            "Add New Playlist"
          )}
        </Button>
      </form>
    </Form>
  );
};
