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
import { playlists } from "./music-sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useCurrentRole } from "@/hooks/use-current-role";

interface AlbumArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
  album: Album;
  aspectRatio?: "portrait" | "square";
  width?: number;
  height?: number;
  addToLibrary?: boolean;
  removeFromLibrary?: boolean;
  addToPlaylist?: boolean;
  createPlaylist?: boolean;
}

export const AlbumArtWork = ({
  album,
  aspectRatio = "portrait",
  width,
  height,
  addToLibrary,
  removeFromLibrary,
  addToPlaylist,
  createPlaylist,
  className,
  ...props
}: AlbumArtworkProps) => {
  const role = useCurrentRole();

  return (
    <Dialog>
      <div className={cn("space-y-3 cursor-pointer", className)} {...props}>
        <ContextMenu>
          <ContextMenuTrigger>
            <div className="overflow-hidden rounded-md">
              <Image
                src={album.cover}
                alt={album.name}
                width={width}
                height={height}
                className={cn(
                  "object-cover transition-all hover:scale-105",
                  `h-[${height}px] w-[${width}px]`,
                  aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
                )}
              />
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-40">
            {addToLibrary && <ContextMenuItem>Add to Library</ContextMenuItem>}
            {/* {removeFromLibrary && (
              <ContextMenuItem>Remove From Librar</ContextMenuItem>
            )} */}

            <ContextMenuSub>
              {addToPlaylist && (
                <ContextMenuSubTrigger>Add to Playlist</ContextMenuSubTrigger>
              )}

              <ContextMenuSubContent className="w-48">
                {role !== "USER" && (
                  <DialogTrigger asChild>
                    <ContextMenuItem>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      New Playlist
                    </ContextMenuItem>
                  </DialogTrigger>
                )}
                <ContextMenuSeparator />
                {playlists.map(
                  (playlist) =>
                    playlist.canBeAddedTo && (
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
              (role !== "USER" && <ContextMenuSeparator />)}
            <ContextMenuItem>Play Next</ContextMenuItem>
            <ContextMenuItem>Play Later</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Like</ContextMenuItem>
            <ContextMenuItem>Share</ContextMenuItem>
            {role !== "USER" && (
              <ContextMenuItem className="bg-destructive hover:bg-destructive">
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
      </DialogContent>
    </Dialog>
  );
};
