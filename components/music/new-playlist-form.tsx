"use client";

import { useEffect, useState, useTransition } from "react";
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
import { ChevronsUpDown, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { getAllMusic } from "@/data/playlistData";
import { newPlaylist } from "@/actions/playlist";
import { allQuery } from "@/utils/constants";
import { AlertDialogCancel, AlertDialogFooter } from "../ui/alert-dialog";

type MusicType = {
  id: string;
  title: string;
};

export const NewPlaylistForm = ({
  addToAlert = false,
}: {
  addToAlert?: boolean;
}) => {
  const queryClient = useQueryClient();

  const [isPending, startTransition] = useTransition();

  const [open, setOpen] = useState(false);
  const [listName, setListName] = useState<string[]>([]);

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const [music, setMusic] = useState<MusicType[] | null>([]);

  useEffect(() => {
    const getMusic = async () => {
      const musics = await getAllMusic();

      if (musics) {
        setMusic(musics);
      }
    };

    getMusic();
  }, []);

  const form = useForm<z.infer<typeof NewPlaylistSchema>>({
    resolver: zodResolver(NewPlaylistSchema),
    defaultValues: {
      name: "",
      musicIds: [],
      canAddTo: "no",
    },
  });

  const onSubmit = (values: z.infer<typeof NewPlaylistSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      const data = await newPlaylist(values);

      try {
        if (data?.error) {
          setError(data?.error);
        }

        if (data?.success) {
          form.reset();
          setSuccess(data?.success);

          queryClient.invalidateQueries({
            predicate: (query) =>
              allQuery.includes(query.queryKey[0] as string),
          });
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
                          "w-full justify-between text-wrap",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value.length > 0
                          ? listName.join(", ")
                          : "Select music(s)"}
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
                        {!music && (
                          <CommandEmpty>No results found.</CommandEmpty>
                        )}
                        <CommandGroup>
                          {music &&
                            music.length > 0 &&
                            music.map((d) => (
                              <CommandItem
                                value={d.title}
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
                                      setListName((prev) => [...prev, d.title]);
                                    } else {
                                      // When the checkbox is unchecked
                                      field.onChange(
                                        field.value?.filter(
                                          (value) => value !== d.id
                                        )
                                      );
                                      setListName((prev) =>
                                        prev.filter((name) => name !== d.title)
                                      );
                                    }
                                  }}
                                />
                                <FormLabel className="ml-2">
                                  {d.title}
                                </FormLabel>
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

        <FormError message={error} />
        <FormSuccess message={success} />

        {addToAlert ? (
          <AlertDialogFooter>
            <AlertDialogCancel className="focus-visible:ring-px w-1/2 hover:bg-gray-500 hover:border-none hover:text-white">
              Cancel
            </AlertDialogCancel>
            <Button disabled={isPending} type="submit" className="w-1/2">
              {isPending ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                "Add New Playlist"
              )}
            </Button>
          </AlertDialogFooter>
        ) : (
          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              "Add New Playlist"
            )}
          </Button>
        )}
      </form>
    </Form>
  );
};
