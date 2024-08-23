"use client";

import { ListMusic, PlusCircle } from "lucide-react";
import { Album } from "./cc";
import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { NewPlaylistForm } from "./new-playlist-form";

import { Playlist } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  addMusicToLibrary,
  addMusicToPlaylist,
  changeMusicStatus,
  deleteMusic,
  deleteMusicFromLibrary,
} from "@/actions/music-update";
import { allQuery } from "@/utils/constants";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { MusicCopy } from "./music-copy";

interface AlbumArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
  album: Album;
  aspectRatio?: "portrait" | "square";
  width?: number;
  height?: number;
  addToLibrary?: boolean;
  fromLibrary?: boolean;
  removeFromLibrary?: boolean;
  addToPlaylist?: boolean;
  createPlaylist?: boolean;
  playlists: Playlist[];
}

export const AlbumArtWork = ({
  album,
  aspectRatio = "portrait",
  width,
  height,
  addToLibrary,
  removeFromLibrary = false,
  fromLibrary = false,
  addToPlaylist,
  createPlaylist,
  playlists,
  className,
  ...props
}: AlbumArtworkProps) => {
  const user = useCurrentUser();

  const queryClient = useQueryClient();

  // CHANGE MUSIC FAVORITE STATUS
  const { data, mutateAsync: changeStatus } = useMutation({
    mutationFn: (params: { id: string; musicId: string }) =>
      changeMusicStatus(params.id, params.musicId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => allQuery.includes(query.queryKey[0] as string),
      });
      toast.success(data?.success || "Music status updated successfully!");
    },
    onError: () => {
      toast.error(data?.error || "Something went wrong. Please try again!");
    },
  });

  // CHANGE MUSIC FAVORITE STATUS
  const { data: libData, mutateAsync: changeLibraryStatus } = useMutation({
    mutationFn: (params: { id: string; musicId: string }) =>
      addMusicToLibrary(params.id, params.musicId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => allQuery.includes(query.queryKey[0] as string),
      });
      toast.success(libData?.success || "Music library updated successfully!");
    },
    onError: () => {
      toast.error(libData?.error || "Something went wrong. Please try again!");
    },
  });

  // DELETE MUSIC LOGIC
  const { data: deleteData, mutateAsync: DeleteMusic } = useMutation({
    mutationFn: (params: { id: string }) =>
      fromLibrary ? deleteMusicFromLibrary(params.id) : deleteMusic(params.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => allQuery.includes(query.queryKey[0] as string),
      });
      const toastMessage = fromLibrary
        ? "Library updated successfully!"
        : "Music deleted successfully!";
      toast.success(deleteData?.success || toastMessage);
    },
    onError: () => {
      toast.error(
        deleteData?.error || "Something went wrong. Please try again!"
      );
    },
  });

  // ADD MUSIC TO PLAYLIST LOGIC
  const { data: addData, mutateAsync: addMusicPlaylist } = useMutation({
    mutationFn: (params: { playlistId: string; musicId: string }) =>
      addMusicToPlaylist(params.playlistId, params.musicId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => allQuery.includes(query.queryKey[0] as string),
      });
      toast.success(
        addData?.success || "Music added to playlist successfully!"
      );
    },
    onError: () => {
      toast.error(addData?.error || "Something went wrong. Please try again!");
    },
  });

  const handleClick = async (id: string, musicId: string) => {
    await changeStatus({ id, musicId });
  };

  const handleLibrary = async (id: string, musicId: string) => {
    await changeLibraryStatus({ id, musicId });
  };

  const handleDelete = async (id: string) => {
    await DeleteMusic({ id });
  };

  const handleAddToPlaylist = async (playlistId: string, musicId: string) => {
    await addMusicPlaylist({ playlistId, musicId });
  };

  return (
    <AlertDialog>
      <Dialog>
        <div className={cn("space-y-3 cursor-pointer", className)} {...props}>
          <ContextMenu>
            <ContextMenuTrigger>
              <div
                className={cn(
                  "relative overflow-hidden rounded-md",
                  `h-[${height}px] w-full sm:w-[220px] md:w-[${width}px]`
                )}
              >
                <Image
                  src={album.cover}
                  alt={album.name}
                  fill
                  sizes="100%"
                  priority
                  className={cn(
                    "object-cover transition-all hover:scale-105",
                    aspectRatio === "portrait"
                      ? "aspect-[3/4]"
                      : "aspect-square"
                  )}
                />
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-40">
              {addToLibrary && user && (
                <ContextMenuItem
                  onClick={() =>
                    handleLibrary(user.id as string, album.id as string)
                  }
                  className={
                    album.libraryIDs &&
                    album?.libraryIDs.includes(user?.id as string)
                      ? "text-red-600"
                      : ""
                  }
                >
                  {album.libraryIDs &&
                  album?.libraryIDs.includes(user?.id as string)
                    ? "Delete from Library"
                    : "Add to Library"}
                </ContextMenuItem>
              )}

              <ContextMenuSub>
                {addToPlaylist && user && user.role !== "USER" && (
                  <ContextMenuSubTrigger>Add to Playlist</ContextMenuSubTrigger>
                )}

                <ContextMenuSubContent className="w-48">
                  {user && user.role !== "USER" && (
                    <AlertDialogTrigger asChild>
                      <ContextMenuItem>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Playlist
                      </ContextMenuItem>
                    </AlertDialogTrigger>
                  )}
                  <ContextMenuSeparator />
                  {playlists &&
                    playlists.map(
                      (playlist) =>
                        !playlist.canAddTo &&
                        !album.playlistIDs?.includes(playlist.id) && (
                          <ContextMenuItem
                            key={playlist.name}
                            onClick={() =>
                              handleAddToPlaylist(
                                playlist.id,
                                album.id as string
                              )
                            }
                          >
                            <ListMusic className="mr-2 h-4 w-4" />
                            {playlist.name}
                          </ContextMenuItem>
                        )
                    )}
                </ContextMenuSubContent>
              </ContextMenuSub>
              {!addToLibrary ||
                !addToPlaylist ||
                !user ||
                (user.role !== "USER" && <ContextMenuSeparator />)}
              <ContextMenuItem>Play Next</ContextMenuItem>
              <ContextMenuItem>Play Later</ContextMenuItem>
              <ContextMenuSeparator />
              {user && user.role && (
                <ContextMenuItem
                  onClick={() =>
                    handleClick(user.id as string, album.id as string)
                  }
                >
                  {album.isLiked ? "Undo Like" : "Like"}
                </ContextMenuItem>
              )}
              <DialogTrigger asChild>
                <ContextMenuItem>Share</ContextMenuItem>
              </DialogTrigger>

              {user && removeFromLibrary && (
                <ContextMenuItem
                  className="bg-destructive hover:bg-destructive"
                  onClick={() => handleDelete(album.id as string)}
                >
                  Delete
                </ContextMenuItem>
              )}
            </ContextMenuContent>
          </ContextMenu>
          <div className="space-y-1 text-sm">
            <h3 className="font-medium leading-none">{album.name}</h3>
            <p className="text-xs text-gray-300">{album.artist}</p>
          </div>
        </div>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>New Playlist</AlertDialogTitle>
            <AlertDialogDescription>
              Create new playlist and add songs here. Click save when
              you&apos;re done.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Separator className="my-2" />
          <NewPlaylistForm addToAlert />
        </AlertDialogContent>

        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-sm">
              Share Music
            </DialogTitle>
            <DialogDescription className="sr-only">
              Music Sharing Link
            </DialogDescription>
          </DialogHeader>
          <Separator />
          <MusicCopy link={album.link as string} />
        </DialogContent>
      </Dialog>
    </AlertDialog>
  );
};
