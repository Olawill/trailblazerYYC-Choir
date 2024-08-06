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
import { NewMusicSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckIcon, ChevronsUpDown, Loader2, PlusCircle } from "lucide-react";
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
import { MusicContent } from "./music-content";

export const NewMusicForm = () => {
  const queryClient = useQueryClient();

  const [isPending, startTransition] = useTransition();

  const [openPlaylist, setOpenPlaylist] = useState(false);
  const [openAuthor, setOpenAuthor] = useState(false);

  const [listName, setListName] = useState<string[]>([]);
  const [authorNames, setAuthorNames] = useState<string[]>([]);

  const [playlists, setPlaylists] = useState([
    { id: "1", name: "Recently Added", canAddTo: false },
    { id: "2", name: "Recently Played", canAddTo: false },
    { id: "3", name: "Top Songs", canAddTo: false },
    { id: "4", name: "Aug 2024 Concert", canAddTo: true },
    { id: "5", name: "Sunday Aug 4, 2024", canAddTo: true },
  ]);

  const [authors, setAuthors] = useState([
    { id: "1", name: "Dunsin Oyekan" },
    { id: "2", name: "Nathaniel Bassey" },
    { id: "3", name: "Jonathan McReynolds" },
    { id: "4", name: "Gabriel Eziashi" },
    { id: "5", name: "Jes Dolapo" },
  ]);

  const form = useForm<z.infer<typeof NewMusicSchema>>({
    resolver: zodResolver(NewMusicSchema),
    defaultValues: {
      title: "",
      link: "",
      playlistIds: [],
      authorIds: [],
      content: [],
    },
  });

  const onSubmit = (values: z.infer<typeof NewMusicSchema>) => {
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
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    {...field}
                    placeholder="Title"
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
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Youtube Link</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    {...field}
                    placeholder="Youtube Link"
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
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lyrics</FormLabel>
                <FormControl>
                  <MusicContent />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="playlistIds"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Playlist(s)</FormLabel>
                <Popover open={openPlaylist} onOpenChange={setOpenPlaylist}>
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
                        {playlists.length === 0 && (
                          <CommandEmpty>No results found.</CommandEmpty>
                        )}
                        <CommandGroup>
                          {playlists &&
                            playlists.length > 0 &&
                            playlists.map((d) => (
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

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="authorIds"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Author(s)</FormLabel>
                <Popover open={openAuthor} onOpenChange={setOpenAuthor}>
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
                          ? authorNames.join(", ")
                          : "Select author(s)"}
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
                        {playlists.length === 0 && (
                          <CommandEmpty>No results found.</CommandEmpty>
                        )}
                        <CommandGroup>
                          {authors &&
                            authors.length > 0 &&
                            authors.map((d) => (
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
                                      setAuthorNames((prev) => [
                                        ...prev,
                                        d.name,
                                      ]);
                                    } else {
                                      // When the checkbox is unchecked
                                      field.onChange(
                                        field.value?.filter(
                                          (value) => value !== d.id
                                        )
                                      );
                                      setAuthorNames((prev) =>
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
            "Add New Music"
          )}
        </Button>
      </form>
    </Form>
  );
};
