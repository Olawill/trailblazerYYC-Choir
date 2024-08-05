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

interface AlbumArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
  album: Album;
  aspectRatio?: "portrait" | "square";
  width?: number;
  height?: number;
}

export const AlbumArtWork = ({
  album,
  aspectRatio = "portrait",
  width,
  height,
  className,
  ...props
}: AlbumArtworkProps) => {
  return (
    <Dialog>
      <div className={cn("space-y-3 cursor-pointer", className)} {...props}>
        <ContextMenu>
          <ContextMenuTrigger>
            <div className="overflow-hidden rounded-md">
              {/* <div
              className={cn(
                "relative overflow-hidden rounded-md",
                aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
              )}
            > */}
              <Image
                src={album.cover}
                alt={album.name}
                width={width}
                height={height}
                // className="transition-all hover:scale-105"
                className={cn(
                  "object-cover transition-all hover:scale-105",
                  `h-[${height}px] w-[${width}px]`,
                  aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
                )}
              />
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-40">
            <ContextMenuItem>Add to Library</ContextMenuItem>
            <ContextMenuSub>
              <ContextMenuSubTrigger>Add to Playlist</ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-48">
                <DialogTrigger asChild>
                  <ContextMenuItem>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Playlist
                  </ContextMenuItem>
                </DialogTrigger>
                <ContextMenuSeparator />
                {playlists.map((playlist) => (
                  <ContextMenuItem key={playlist}>
                    <ListMusic className="mr-2 h-4 w-4" />
                    {playlist}
                  </ContextMenuItem>
                ))}
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSeparator />
            <ContextMenuItem>Play Next</ContextMenuItem>
            <ContextMenuItem>Play Later</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Like</ContextMenuItem>
            <ContextMenuItem>Share</ContextMenuItem>
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
