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
import { NewMusicSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Loader2 } from "lucide-react";

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
import { MusicContent } from "./music-content";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { addAuthor, getAuthors, getPlaylists } from "@/data/playlistData";
import { newMusic } from "@/actions/playlist";
import { allQuery } from "@/utils/constants";
import { ScrollArea } from "../ui/scroll-area";

type PlayListType = {
  id: string;
  name: string;
  canAddTo: boolean;
};

type AuthorType = Omit<PlayListType, "canAddTo">;

export const NewMusicForm = () => {
  const queryClient = useQueryClient();

  const [isPending, startTransition] = useTransition();

  const [openPlaylist, setOpenPlaylist] = useState(false);
  const [openAuthor, setOpenAuthor] = useState(false);

  const [listName, setListName] = useState<string[]>([]);
  const [authorNames, setAuthorNames] = useState<string[]>([]);

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const [playlists, setPlaylists] = useState<PlayListType[] | null>([]);

  const [authors, setAuthors] = useState<AuthorType[]>([]);

  const [inputValue, setInputValue] = useState("");

  const addValue = async (item: string) => {
    const author = await addAuthor(item);

    if (author) {
      setAuthors((prev) => [...prev, { id: author.id, name: author.name }]);
      setInputValue("");
    }
  };

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

  useEffect(() => {
    const getAllPlaylist = async () => {
      const playlists = await getPlaylists();

      if (playlists) {
        const nonGenericPlaylist = playlists.filter((p) => !p.canAddTo);
        setPlaylists(nonGenericPlaylist);
      }
    };

    const getAllAuthors = async () => {
      const authors = await getAuthors();

      if (authors) {
        setAuthors(authors);
      }
    };

    getAllPlaylist();
    getAllAuthors();
  }, []);

  const onSubmit = (values: z.infer<typeof NewMusicSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      const data = await newMusic(values);

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
      <ScrollArea className="h-[400px] md:h-[600px] px-1">
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
                      className="focus-visible:ring-px"
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
                      className="focus-visible:ring-px"
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
                          {!playlists && (
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
                                        setListName((prev) => [
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
                                        setListName((prev) =>
                                          prev.filter((name) => name !== d.name)
                                        );
                                      }
                                    }}
                                  />
                                  <FormLabel className="ml-2">
                                    {d.name}
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
                          placeholder="Select artist(s)"
                          className="h-9"
                          value={inputValue}
                          onChangeCapture={(e) =>
                            setInputValue(e.currentTarget.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addValue(inputValue);
                            }
                          }}
                        />
                        <CommandList>
                          {!playlists && (
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
                                  <FormLabel className="ml-2">
                                    {d.name}
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
      </ScrollArea>
    </Form>
  );
};
