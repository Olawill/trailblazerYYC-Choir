"use client";

import { deleteMusic, deleteMusicFromPlaylist } from "@/actions/music-update";
import { updatePlaylist } from "@/actions/playlist";
import { RoleGate } from "@/components/auth/role-gate";
import { EditMusicForm } from "@/components/music/edit-music-form";
import { EditPlaylistForm } from "@/components/music/edit-playlist-form";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deletePlaylist,
  getAllPlay,
  getAllPlaylistMusic,
  getCurrentPlaylistMusic,
} from "@/data/playlistData";
import { PlaylistManagerSchema } from "@/schemas";
import { allQuery } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Playlist, UserRole } from "@prisma/client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FilePen, Loader, Trash } from "lucide-react";

import Image from "next/image";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface MusicType {
  title: string;
  id: string;
  videoId: string | null;
  count: number;
  artists: string;
}

const ManageMusicPage = () => {
  const qc = useQueryClient();

  const [playlistDeleteAlertOpen, setPlaylistDeleteAlertOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  const [list, setList] = useState("all");
  const [current, setCurrent] = useState<"yes" | "no">("no");
  const [currentList, setCurrentList] = useState<Playlist | undefined>(
    undefined
  );

  const [selectedItem, setSelectedItem] = useState<MusicType | null>(null);

  const [trackIdToEdit, setTrackIdToEdit] = useState<string | null>(null);
  const [editTrackOpen, setEditTrackOpen] = useState(false);

  const handleOpenDialog = (item: MusicType) => {
    setSelectedItem(item);
  };

  const handleCloseDialog = () => {
    setSelectedItem(null);
  };

  const { data: playlists, isLoading } = useQuery({
    queryKey: ["playlists"],
    queryFn: () => getAllPlay(),
  });

  const { data: allMusic, isLoading: allLoading } = useQuery({
    queryKey: ["allMusics"],
    queryFn: () => getAllPlaylistMusic(),
  });

  const { data: currentMusic, isLoading: currentLoading } = useQuery({
    queryKey: ["currentMusics", currentList?.id],
    queryFn: () =>
      currentList
        ? getCurrentPlaylistMusic(currentList.id)
        : Promise.resolve([]),
    enabled: !!currentList,
  });

  useEffect(() => {
    if (list !== "all") {
      setCurrentList(playlists?.find((playlist) => playlist.name === list));
    } else {
      setCurrentList(undefined);
    }
  }, [list]);

  const form = useForm<z.infer<typeof PlaylistManagerSchema>>({
    resolver: zodResolver(PlaylistManagerSchema),
    defaultValues: {
      name: "", // Set default value for name
      current: "no", // Set default value for current
    },
  });

  useEffect(() => {
    if (currentList) {
      // Ensure values are valid and non-empty
      const newCurrentValue = currentList.current ? "yes" : "no";

      setCurrent(newCurrentValue);

      form.reset({
        name: currentList.name,
        current: newCurrentValue,
      });
    }
  }, [currentList, form]);

  useEffect(() => {
    form.setValue("current", current);
  }, [current]);

  const onSubmit = (values: z.infer<typeof PlaylistManagerSchema>) => {
    startTransition(async () => {
      const data = await updatePlaylist(values, currentList?.id as string);

      try {
        if (data?.error) {
          toast.error("Something went wrong. Please try again!");
        }

        if (data?.success) {
          toast.success("Playlist updated!");

          qc.invalidateQueries({
            predicate: (query) =>
              allQuery.includes(query.queryKey[0] as string),
          });
        }

        if (!data) {
          window.location.reload();
        }
      } catch {
        toast.error("Something went wrong!");
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const data = await deletePlaylist(id);

      try {
        if (data) {
          toast.success("Playlist deleted!");

          qc.invalidateQueries({
            predicate: (query) =>
              allQuery.includes(query.queryKey[0] as string),
          });

          setList("all");

          form.reset();
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong. Please try again!");
      }
    });
  };

  // DELETE MUSIC LOGIC
  const { data: deleteOption, mutateAsync: DeleteOption } = useMutation({
    mutationFn: (params: { musicId: string; playlistId: string }) =>
      currentList
        ? deleteMusicFromPlaylist(params.musicId, params.playlistId)
        : deleteMusic(params.musicId),
    onSuccess: () => {
      qc.invalidateQueries({
        predicate: (query) => allQuery.includes(query.queryKey[0] as string),
      });
      const toastMessage = currentList
        ? "Playlist updated successfully!"
        : "Music deleted successfully!";
      toast.success(deleteOption?.success || toastMessage);
    },
    onError: () => {
      toast.error(
        deleteOption?.error || "Something went wrong. Please try again!"
      );
    },
  });

  const handleTrackDelete = async (musicId: string, playlistId: string) => {
    await DeleteOption({ musicId, playlistId });
  };

  const handlePlaylistDeleteTrigger = () => {
    setPlaylistDeleteAlertOpen((prev) => !prev);
  };

  return (
    <RoleGate allowedRole={[UserRole.ADMIN, UserRole.SUPERUSER]} onPage>
      <AlertDialog>
        <div className="col-span-3 lg:col-span-4 border rounded-md">
          <div className="h-full w-full px-4 py-6 lg:px-8 space-y-4">
            <div className="grid grid-cols-1 gap-6 max-w-6xl mx-auto px-2 sm:px-4 py-8">
              <div className="col-span-1 grid gap-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    Playlist Management
                  </h1>
                </div>
                {isLoading && (
                  <div className="space-y-2">
                    <Skeleton className="w-20 h-4" />
                    <Skeleton className="w-full h-10" />
                  </div>
                )}
                {playlists && (
                  <div className="w-full grid gap-2">
                    <Label htmlFor="playlist-select">Select Playlist</Label>
                    <Select
                      name="playlist-select"
                      value={list}
                      onValueChange={setList}
                    >
                      <SelectTrigger className="w-full bg-transparent focus:ring-px">
                        <SelectValue placeholder="Select a playlist" />
                      </SelectTrigger>
                      <SelectContent className="bg-background w-full">
                        <SelectItem value="all">All</SelectItem>
                        {playlists &&
                          playlists.map(
                            (playlist) =>
                              !playlist.canAddTo && (
                                <SelectItem
                                  key={playlist.id}
                                  value={playlist.name}
                                >
                                  {playlist.name}
                                </SelectItem>
                              )
                          )}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="col-span-1 grid grid-cols-1 gap-6">
                {list !== "all" && (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <Card className="bg-transparent">
                        <CardHeader>
                          <CardTitle>Playlist Details</CardTitle>
                          <CardDescription className="text-gray-300">
                            Edit your playlist information
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-4">
                            <div className="grid gap-2">
                              <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                      <Input
                                        disabled={isPending}
                                        {...field}
                                        placeholder="Playlist Name"
                                        className="focus-visible:ring-px"
                                        type="text"
                                      />
                                    </FormControl>

                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="grid gap-2">
                              <FormField
                                control={form.control}
                                name="current"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Current List?</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      value={field.value}
                                      disabled={isPending}
                                    >
                                      <FormControl>
                                        <SelectTrigger className="w-full bg-transparent focus:ring-px">
                                          <SelectValue placeholder="Current Playlist?" />
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
                          </div>
                        </CardContent>
                        <CardFooter className="justify-end">
                          <Button type="submit" size="sm" className="w-32">
                            {isPending ? (
                              <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                              "Save Changes"
                            )}
                          </Button>
                        </CardFooter>
                      </Card>
                    </form>
                  </Form>
                )}

                <Card className="bg-transparent">
                  <CardHeader>
                    <CardTitle>Tracks</CardTitle>
                    <CardDescription className="text-gray-300">
                      Manage the tracks in your playlist
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="m-auto">
                    <ScrollArea className="h-[300px]">
                      {isLoading ? (
                        <div className="h-[300px] w-full flex items-center justify-center">
                          <Loader className="animate-spin" />
                        </div>
                      ) : allLoading || currentLoading ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-gray-300">
                                Title
                              </TableHead>
                              <TableHead className="text-gray-300">
                                Artist
                              </TableHead>
                              <TableHead className="text-gray-300">
                                Content
                              </TableHead>
                              <TableHead className="text-right text-gray-300">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>
                                <ManageMusicPage.Skeleton />
                              </TableCell>
                              <TableCell>
                                <ManageMusicPage.Skeleton />
                              </TableCell>
                              <TableCell>
                                <ManageMusicPage.Skeleton />
                              </TableCell>
                              <TableCell>
                                <ManageMusicPage.Skeleton />
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      ) : (!currentList && allMusic && allMusic?.length > 0) ||
                        (currentList &&
                          currentMusic &&
                          currentMusic?.length > 0) ? (
                        <>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-gray-300">
                                  Title
                                </TableHead>
                                <TableHead className="text-gray-300">
                                  Artist
                                </TableHead>
                                <TableHead className="text-gray-300">
                                  Content
                                </TableHead>
                                <TableHead className="text-right text-gray-300">
                                  Actions
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {(currentList ? currentMusic : allMusic)?.map(
                                (c) => (
                                  <TableRow
                                    key={c.id}
                                    className="max-[639px]:text-[12px]"
                                  >
                                    <TableCell>
                                      <div className="grid gap-1">
                                        <div className="flex items-center gap-2">
                                          <Image
                                            src={
                                              c.videoId
                                                ? `https://img.youtube.com/vi/${c.videoId}/0.jpg`
                                                : "/noWallpaper.jpg"
                                            }
                                            alt="music-image"
                                            width={32}
                                            height={32}
                                            className="w-8 h-8 rounded-full"
                                          />
                                          <div className="font-medium tracking-tight">
                                            {c.title.split(" - ")[0]}
                                          </div>
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell className="truncate text-wrap">
                                      {c.artists}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {c.count}
                                    </TableCell>
                                    <TableCell className="flex justify-end my-auto space-x-1">
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="hover:bg-emerald-400 hover:text-white"
                                        onClick={() => {
                                          setTrackIdToEdit(c.id);
                                          setEditTrackOpen(true);
                                        }}
                                      >
                                        <FilePen className="w-5 h-5" />
                                        <span className="sr-only">Edit</span>
                                      </Button>

                                      <AlertDialogTrigger asChild>
                                        <Button
                                          size="icon"
                                          variant="destructive"
                                          className="hover:bg-rose-700"
                                          onClick={() => handleOpenDialog(c)}
                                        >
                                          <Trash className="w-5 h-5" />
                                          <span className="sr-only">
                                            Delete
                                          </span>
                                        </Button>
                                      </AlertDialogTrigger>
                                    </TableCell>
                                  </TableRow>
                                )
                              )}
                            </TableBody>
                          </Table>
                          {selectedItem && (
                            <AlertDialogContent className="border-none">
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <Separator />
                                <AlertDialogDescription className="text-gray-300">
                                  {currentList ? (
                                    <>
                                      This will delete{" "}
                                      <span className="font-extrabold italic">
                                        {selectedItem.title}
                                      </span>{" "}
                                      from the{" "}
                                      <span className="font-extrabold italic">
                                        {currentList.name}
                                      </span>{" "}
                                      playlist and remove all its data.
                                    </>
                                  ) : (
                                    <>
                                      This action cannot be undone. This will
                                      permanently delete your{" "}
                                      <span className="font-extrabold italic">
                                        {selectedItem.title}
                                      </span>{" "}
                                      and remove all its data.
                                    </>
                                  )}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel
                                  className="w-32"
                                  onClick={handleCloseDialog}
                                >
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  className="w-32 hover:bg-destructive hover:text-white"
                                  onClick={() =>
                                    handleTrackDelete(
                                      selectedItem.id,
                                      currentList?.id as string
                                    )
                                  }
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          )}
                        </>
                      ) : (
                        <div className="text-gray-300 text-lg italic text-center w-full p-2 border rounded-md">
                          🎵This playlist is on a sound diet — no tracks to
                          speak of yet!🎵
                        </div>
                      )}
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                    {list !== "all" && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="flex justify-center pt-4">
                            <Button size="sm">Add Music</Button>
                          </div>
                        </DialogTrigger>

                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Music to Playlist</DialogTitle>
                            <DialogDescription>
                              Add music to playlist. Click save when you&apos;re
                              done.
                            </DialogDescription>
                          </DialogHeader>
                          <Separator className="my-2" />
                          <EditPlaylistForm list={currentList!} />
                        </DialogContent>
                      </Dialog>
                    )}
                  </CardContent>
                  {list !== "all" && (
                    <CardFooter className="justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handlePlaylistDeleteTrigger}
                        className="w-32 hover:bg-destructive hover:border-none hover:text-white"
                      >
                        Delete Playlist
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </div>
      </AlertDialog>

      <AlertDialog
        open={playlistDeleteAlertOpen}
        onOpenChange={setPlaylistDeleteAlertOpen}
      >
        <AlertDialogContent className="border-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <Separator />
            <AlertDialogDescription className="text-gray-300">
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-extrabold italic">{currentList?.name}</span>{" "}
              playlist and remove all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="w-32">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="w-32 hover:bg-destructive hover:text-white"
              onClick={() => handleDelete(currentList?.id!)}
            >
              {isPending ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {trackIdToEdit && (
        <Dialog open={editTrackOpen} onOpenChange={setEditTrackOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Music </DialogTitle>
              <DialogDescription>
                Edit music. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <Separator className="my-2" />
            <EditMusicForm
              musicId={trackIdToEdit}
              setEditTrackOpen={setEditTrackOpen}
            />
          </DialogContent>
        </Dialog>
      )}
    </RoleGate>
  );
};

ManageMusicPage.Skeleton = function MusiclistSkeleton() {
  return (
    <div className="space-y-1">
      <Skeleton className="w-full h-14 justify-start bg-gray-500" />
      <Skeleton className="w-full h-14 justify-start bg-gray-500" />
      <Skeleton className="w-full h-14 justify-start bg-gray-500" />
      <Skeleton className="w-full h-14 justify-start bg-gray-500" />
      <Skeleton className="w-full h-14 justify-start bg-gray-500" />
    </div>
  );
};

export default ManageMusicPage;
