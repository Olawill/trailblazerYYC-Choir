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
import { EditPlaylistSchema, NewPlaylistSchema } from "@/schemas";
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
import { editPlaylist, newPlaylist } from "@/actions/playlist";
import { allQuery } from "@/utils/constants";

type MusicType = {
  id: string;
  title: string;
};

type ListType = {
  id: string;
  name: string;
  canAddTo: boolean;
  current: boolean;
  musicIDs: string[];
  createdAt: Date;
  updatedAt: Date;
};

export const EditPlaylistForm = ({ list }: { list: ListType }) => {
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

        const modListName = musics?.filter((m) =>
          list?.musicIDs.includes(m.id)
        );

        setListName(modListName?.map((m) => m.title) as string[]);
      }
    };

    getMusic();
  }, []);

  const form = useForm<z.infer<typeof EditPlaylistSchema>>({
    resolver: zodResolver(EditPlaylistSchema),
    defaultValues: {
      name: list?.name,
      musicIds: list?.musicIDs,
    },
  });

  const onSubmit = (values: z.infer<typeof EditPlaylistSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      const data = await editPlaylist(values, list.id);

      try {
        if (data?.error) {
          setError(data?.error);
        }

        if (data?.success) {
          // form.reset();
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
                          "w-full justify-between text-wrap line-clamp-2",
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

        <Button disabled={isPending} type="submit" className="w-full">
          {isPending ? (
            <Loader2 className="animate-spin h-4 w-4" />
          ) : (
            "Add New Music"
          )}
        </Button>
      </form>
    </Form>
  );
};
