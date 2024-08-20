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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, Suspense } from "react";
import { NewPlaylistForm } from "./new-playlist-form";
import { useQuery } from "@tanstack/react-query";
import { getAllPlay } from "@/data/playlistData";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export const MusicSidebar = ({ className }: SidebarProps) => {
  const user = useCurrentUser();

  const { data: playlists, isLoading } = useQuery({
    queryKey: ["playlists"],
    queryFn: () => getAllPlay(),
  });

  const [activeId, setActiveId] = useState<string>("");

  // console.log(currentUrl);

  const pathname = usePathname();

  // const handleClick = (id: string) => {
  //   setActiveId(`#${id}`);

  //   const elem = document.getElementById(id);

  //   if (elem) {
  //     elem.scrollIntoView({ behavior: "smooth" });
  //   }
  // };

  return (
    <div className={cn("pb-12 -ml-4 sticky", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Discover
          </h2>
          <div className="space-y-1">
            {isLoading ? (
              <>
                <Skeleton className="w-full h-10 justify-start bg-gray-500" />
                <Skeleton className="w-full h-10 justify-start bg-gray-500" />
                <Skeleton className="w-full h-10 justify-start bg-gray-500" />
              </>
            ) : (
              <>
                <Link
                  href="/"
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    pathname === "/"
                      ? "bg-muted hover:bg-muted"
                      : "hover:bg-background",
                    "w-full justify-start"
                  )}
                >
                  <CirclePlay className="mr-2 h-4 w-4" />
                  Listen Now
                </Link>

                <Link
                  href="/browse"
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    pathname === "/browse"
                      ? "bg-muted hover:bg-muted"
                      : "hover:bg-background",
                    "w-full justify-start"
                  )}
                >
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  Browse
                </Link>

                {user && (
                  <Link
                    href="/favs"
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      pathname === "/favs"
                        ? "bg-muted hover:bg-muted"
                        : "hover:bg-background",
                      "w-full justify-start"
                    )}
                  >
                    <FolderHeart className="mr-2 h-4 w-4" />
                    Favorite
                  </Link>
                )}
              </>
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
              {isLoading ? (
                <div className="p-2">
                  <Skeleton className="w-full h-10 justify-start bg-gray-500" />
                </div>
              ) : (
                user &&
                user?.role !== "USER" && (
                  <Link
                    href="/manage"
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      pathname === "/manage"
                        ? "bg-muted hover:bg-muted"
                        : "hover:bg-background",
                      "w-full justify-start"
                    )}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Manage
                  </Link>
                )
              )}

              {isLoading && <MusicSidebar.Skeleton />}

              <Suspense fallback={<MusicSidebar.Skeleton />}>
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
              </Suspense>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

MusicSidebar.Skeleton = function PlaylistSkeleton() {
  return (
    <div className="space-y-1 p-2">
      <Skeleton className="w-full h-10 justify-start bg-gray-500" />
      <Skeleton className="w-full h-10 justify-start bg-gray-500" />
      <Skeleton className="w-full h-10 justify-start bg-gray-500" />
      <Skeleton className="w-full h-10 justify-start bg-gray-500" />
      <Skeleton className="w-full h-10 justify-start bg-gray-500" />
    </div>
  );
};
