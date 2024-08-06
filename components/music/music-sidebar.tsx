"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import {
  CirclePlay,
  FolderHeart,
  LayoutGrid,
  ListMusic,
  PlusCircle,
  Settings,
  User,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NewPlaylistForm } from "./new-playlist-form";

export type Playlist = (typeof playlists)[number];

export const playlists = [
  { name: "Recently Added", canBeAddedTo: false },
  { name: "Recently Played", canBeAddedTo: false },
  { name: "Top Songs", canBeAddedTo: false },
  { name: "Aug 2024 Concert", canBeAddedTo: true },
  { name: "Sunday Aug 4, 2024", canBeAddedTo: true },
];

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  playlists: Playlist[];
}

export const MusicSidebar = ({ className, playlists }: SidebarProps) => {
  const user = useCurrentUser();

  const [currentUrl, setCurrentUrl] = useState("");

  // console.log(currentUrl);

  const pathname = usePathname();

  const handleClick = (id: string) => {
    setCurrentUrl(`#${id}`);

    const elem = document.getElementById(id);

    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={cn("pb-12 -ml-4 sticky", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Discover
          </h2>
          <div className="space-y-1">
            <Link
              href="#listen-now"
              onClick={() => handleClick("listen-now")}
              scroll={false}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                currentUrl === "#listen-now"
                  ? "bg-muted hover:bg-muted"
                  : "hover:bg-background",
                "w-full justify-start"
              )}
            >
              <CirclePlay className="mr-2 h-4 w-4" />
              Listen Now
            </Link>

            <Button variant="ghost" className="w-full justify-start">
              <LayoutGrid className="mr-2 h-4 w-4" />
              Browse
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Library
          </h2>
          <div className="space-y-1">
            {user && (
              <Link
                href="#made-for-you"
                onClick={() => handleClick("made-for-you")}
                scroll={false}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  currentUrl === "#made-for-you"
                    ? "bg-muted hover:bg-muted"
                    : "hover:bg-background",
                  "w-full justify-start"
                )}
              >
                <User className="mr-2 h-4 w-4" />
                Made for You
              </Link>
            )}

            {user && (
              <Button variant="ghost" className="w-full justify-start">
                <FolderHeart className="mr-2 h-4 w-4" />
                Favorite
              </Button>
            )}
          </div>
        </div>
        <div className="py-2">
          <div className="flex items-center justify-between">
            <h2 className="relative px-7 text-lg font-semibold tracking-tight">
              Playlists
            </h2>
            {user && user?.role !== "USER" && (
              <Dialog>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          type="button"
                          className="focus-visible:ring-px bg-transparent hover:bg-transparent"
                        >
                          <PlusCircle />
                        </Button>
                      </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add New Playlist</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>New Playlist</DialogTitle>
                    <DialogDescription>
                      Create new playlist and add songs here. Click save when
                      you&apos;re done.
                    </DialogDescription>
                  </DialogHeader>
                  <Separator className="my-2" />
                  <NewPlaylistForm />
                </DialogContent>
              </Dialog>
            )}
          </div>
          <ScrollArea className="h-[300px] px-1">
            <div className="space-y-1 p-2">
              {user && user?.role !== "USER" && (
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Manage
                </Button>
              )}
              {playlists?.map((playlist, i) => (
                <Button
                  key={`${playlist.name}-${i}`}
                  variant="ghost"
                  className="w-full justify-start font-normal"
                >
                  <ListMusic className="mr-2 h-4 w-4" />
                  {playlist.name}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};
