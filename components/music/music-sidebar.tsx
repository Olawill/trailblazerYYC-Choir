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
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export type Playlist = (typeof playlists)[number];

export const playlists = [
  "Recently Added",
  "Recently Played",
  "Top Songs",
  "Aug 2024 Concert",
  "Sunday Aug 4, 2024",
];

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  playlists: Playlist[];
}

export const MusicSidebar = ({ className, playlists }: SidebarProps) => {
  const user = useCurrentUser();

  const [currentUrl, setCurrentUrl] = useState("#listen-now");

  const pathname = usePathname();

  console.log(pathname);

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
              onClick={() => setCurrentUrl("#listen-now")}
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
            {/* <Button variant="ghost" className="w-full justify-start">
              <CirclePlay className="mr-2 h-4 w-4" />
              Listen Now
            </Button> */}
            <Button variant="ghost" className="w-full justify-start">
              <LayoutGrid className="mr-2 h-4 w-4" />
              Browse
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <FolderHeart className="mr-2 h-4 w-4" />
              Favorite
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Library
          </h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <ListMusic className="mr-2 h-4 w-4" />
              Playlists
            </Button>
            {user && (
              <Link
                href="#made-for-you"
                onClick={() => setCurrentUrl("#made-for-you")}
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
              // <Button variant="ghost" className="w-full justify-start">
              //   <User className="mr-2 h-4 w-4" />
              //   Made for You
              // </Button>
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
                </DialogContent>
              </Dialog>
            )}
          </div>
          <ScrollArea className="h-[300px] px-1">
            <div className="space-y-1 p-2">
              {playlists?.map((playlist, i) => (
                <Button
                  key={`${playlist}-${i}`}
                  variant="ghost"
                  className="w-full justify-start font-normal"
                >
                  <ListMusic className="mr-2 h-4 w-4" />
                  {playlist}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};
