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
import { changeMusicStatus } from "@/actions/music-update";
import { allQuery } from "@/utils/constants";

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
  const { data, mutateAsync: changeRole } = useMutation({
    mutationFn: (params: { id: string; musicId: string }) =>
      changeMusicStatus(params.id, params.musicId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => allQuery.includes(query.queryKey[0] as string),
      });
    },
  });

  // DELETE MUSIC LOGIC
  // const { mutateAsync: DeleteUser } = useMutation({
  //   mutationFn: (params: { id: string }) => deleteUser(params.id),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({
  //       predicate: (query) => allQuery.includes(query.queryKey[0] as string),
  //     });
  //   },
  // });

  const handleClick = async (id: string, musicId: string) => {
    await changeRole({ id, musicId });
  };

  // const handleDelete = async (id: string) => {
  //   await DeleteUser({ id });
  // };

  return (
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
                // width={width}
                // height={height}
                fill
                sizes="100%"
                className={cn(
                  "object-cover transition-all hover:scale-105",
                  // `h-[${height}px] w-full min-[640px]:w-[${
                  //   width! - 100
                  // }px] md:w-[${width}px]`,
                  aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
                )}
              />
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-40">
            {addToLibrary && user && (
              <ContextMenuItem>Add to Library</ContextMenuItem>
            )}
            {/* {removeFromLibrary && (
              <ContextMenuItem>Remove From Librar</ContextMenuItem>
            )} */}

            <ContextMenuSub>
              {addToPlaylist && user && user.role !== "USER" && (
                <ContextMenuSubTrigger>Add to Playlist</ContextMenuSubTrigger>
              )}

              <ContextMenuSubContent className="w-48">
                {user && user.role !== "USER" && (
                  <DialogTrigger asChild>
                    <ContextMenuItem>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      New Playlist
                    </ContextMenuItem>
                  </DialogTrigger>
                )}
                <ContextMenuSeparator />
                {playlists &&
                  playlists.map(
                    (playlist) =>
                      !playlist.canAddTo &&
                      !album.playlistIDs?.includes(playlist.id) && (
                        <ContextMenuItem key={playlist.name}>
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
            <ContextMenuItem>Share</ContextMenuItem>
            {user && removeFromLibrary && (
              <ContextMenuItem
                className="bg-destructive hover:bg-destructive"
                onClick={() =>
                  fromLibrary
                    ? console.log("from library")
                    : console.log("from database")
                }
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Playlist</DialogTitle>
          <DialogDescription>
            Create new playlist and add songs here. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
        <Separator className="my-2" />
        <NewPlaylistForm />
      </DialogContent>
    </Dialog>
  );
};
