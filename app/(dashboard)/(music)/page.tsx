"use client";

import { AlbumArtWork } from "@/components/music/album-artwork";
import { listenNowAlbums, madeForYouAlbums } from "@/components/music/cc";
import { Header } from "@/components/music/header";
import { MusicSidebar } from "@/components/music/music-sidebar";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getAllPlay,
  getCurrentList,
  getLibraryMusic,
  getPlaylistMusic,
} from "@/data/playlistData";

import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import { genericPlaylistFunction, PlaylistFunction } from "@/utils/constants";

import { Playlist } from "@prisma/client";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { Settings } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function Home() {
  const user = useCurrentUser();

  const qC = useQueryClient();

  const { data: playlists, isLoading } = useQuery({
    queryKey: ["playlists"],
    queryFn: () => getAllPlay(),
  });

  // FOR THE CURRENT LIST
  const { data: listenNow, isLoading: listenLoading } = useQuery({
    queryKey: ["listen"],
    queryFn: () => getCurrentList(),
  });

  const modlistenNow = listenNow?.map((l) => {
    return {
      id: l.id,
      name: l.title.split(" - ")[0],
      cover: l.videoId
        ? `https://img.youtube.com/vi/${l.videoId}/0.jpg`
        : "/noWallpaper.jpg",
      artist: l.authors.map((a) => a.name).join(", "),
      isLiked: user ? l.favorite.includes(user?.id as string) : false,
      playlistIDs: l.playlistIDs,
      libraryIDs: l.libraryIDs,
    };
  });

  // FOR THE LIBRARY LIST
  const { data: libMusic, isLoading: libLoading } = useQuery({
    queryKey: ["library"],
    queryFn: () => getLibraryMusic(user?.id as string),
  });

  const libTracks = libMusic?.map((l) => {
    return {
      id: l.id,
      name: l.title.split(" - ")[0],
      cover: l.videoId
        ? `https://img.youtube.com/vi/${l.videoId}/0.jpg`
        : "/noWallpaper.jpg",
      artist: l.artists,
      isLiked: user ? l.favorite.includes(user?.id as string) : false,
      playlistIDs: l.playlistIDs,
    };
  });

  // FOR ALL OTHER PLAYLISTS
  const filteredList = playlists?.filter((playlist) => !playlist.current);

  const playlistQueries = useQueries({
    queries: (filteredList || []).map((playlist) => {
      const playlistName = playlist.name as keyof PlaylistFunction;

      const queryFn =
        genericPlaylistFunction[playlistName] ||
        (() => getPlaylistMusic(playlist.name as string));

      return {
        queryKey: ["listMusic", playlist.name],
        queryFn,
      };
    }),
  });

  // Map through playlistQueries to extract data
  const playlistData = playlistQueries.map((query, index) => {
    const listTracks = query.data?.map((l) => {
      return {
        id: l.id,
        name: l.title.split(" - ")[0],
        cover: l.videoId
          ? `https://img.youtube.com/vi/${l.videoId}/0.jpg`
          : "/noWallpaper.jpg",
        artist: l.artists,
        isLiked: user ? l.favorite.includes(user?.id as string) : false,
        playlistIDs: l.playlistIDs,
      };
    });

    return {
      isLoading: query.isLoading,
      data: listTracks,
      name: filteredList?.[index].name,
    };
  });

  return (
    <div className="col-span-3 lg:col-span-4 border rounded-md">
      <div className="h-full w-full px-4 py-6 lg:px-8 space-y-4">
        <div id="listen-now">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-light">
                Listen Now
              </h2>

              {user && user?.role !== "USER" && (
                <Link
                  href="/manage"
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "lg:hidden p-0 bg-transparent hover:bg-transparent justify-end"
                  )}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span className="sr-only">Manage</span>
                </Link>
              )}
            </div>
            <p className="text-sm text-gray-300">
              Current List for Upcoming Program.
            </p>
          </div>
          <Separator className="my-4" />
          <div className="relative">
            <ScrollArea>
              <div className="flex space-x-4 pb-4">
                {listenLoading && <Home.Skeleton />}
                <Suspense fallback={<Home.Skeleton />}>
                  {modlistenNow &&
                    modlistenNow.map((album) => (
                      <AlbumArtWork
                        key={album.name}
                        album={album}
                        playlists={playlists as Playlist[]}
                        className="w-[250px]"
                        aspectRatio="portrait"
                        addToLibrary
                        addToPlaylist
                        width={250}
                        height={330}
                      />
                    ))}
                  {(!modlistenNow || modlistenNow.length === 0) && (
                    <div className="w-full italic text-center text-base text-gray-300 border rounded-md p-2">
                      🎵 The &apos;Listen Now&apos; playlist is a bit too quiet
                      — looks like it&apos;s taking a nap! 🎵
                    </div>
                  )}
                </Suspense>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>

        {user && (
          <div id="made-for-you">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-light">
                Made For You
              </h2>
              <p className="text-sm text-gray-300">
                Your Personal Playlist. Updated Daily.
              </p>
            </div>
            <Separator className="my-4" />
            <div className="relative">
              <ScrollArea>
                <div className="flex space-x-4 pb-4">
                  {libLoading && <Home.Skeleton />}
                  <Suspense fallback={<Home.Skeleton />}>
                    {libTracks &&
                      libTracks?.map((album) => (
                        <AlbumArtWork
                          key={album.name}
                          playlists={playlists as Playlist[]}
                          album={album}
                          className="w-[250px]"
                          aspectRatio="portrait"
                          removeFromLibrary
                          fromLibrary
                          width={250}
                          height={330}
                        />
                      ))}
                    {(!libTracks || libTracks?.length === 0) && (
                      <div className="w-full italic text-center text-base text-gray-300 border rounded-md p-2">
                        🎵 The &apos;Made for You&apos; playlist must be on a
                        break — it&apos;s still finding its groove! 🎵
                      </div>
                    )}
                  </Suspense>
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </div>
        )}

        <div className="lg:hidden">
          {playlists &&
            playlistData &&
            playlistData.map((playlist, index) => {
              return (
                <div key={index}>
                  <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-light">
                      {playlist.name}
                    </h2>
                    <p className="text-sm text-gray-300">{playlist.name}</p>
                  </div>
                  <Separator className="my-4" />
                  <div className="relative">
                    <ScrollArea>
                      <div className="flex space-x-4 pb-4">
                        {playlist.isLoading && <Home.Skeleton />}
                        <Suspense fallback={<Home.Skeleton />}>
                          {playlist?.data?.map((album) => (
                            <AlbumArtWork
                              key={album.name}
                              playlists={playlists}
                              album={album}
                              className="w-[250px]"
                              aspectRatio="portrait"
                              width={250}
                              height={330}
                            />
                          ))}

                          {(!playlist.data || playlist.data?.length === 0) && (
                            <div className="w-full italic text-center text-base text-gray-300 border rounded-md p-2">
                              {`🎵 The '${playlist?.name}' playlist must be on a
                        break — it's still finding its groove! 🎵`}
                            </div>
                          )}
                        </Suspense>
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

Home.Skeleton = function AlbumSkeleton() {
  return (
    <div className="flex space-x-4">
      <div className="space-y-3 w-[250px]">
        <div className="overflow-hidden rounded-md">
          <Skeleton className="object-cover transition-all hover:scale-105 h-[330px] w-[250px] bg-gray-500" />
        </div>

        <div className="space-y-1 text-sm">
          <Skeleton className="w-14 h-3 bg-gray-500" />
          <Skeleton className="w-20 h-3 bg-gray-500" />
        </div>
      </div>

      <div className="space-y-3 w-[250px]">
        <div className="overflow-hidden rounded-md">
          <Skeleton className="object-cover transition-all hover:scale-105 h-[330px] w-[250px] bg-gray-500" />
        </div>

        <div className="space-y-1 text-sm">
          <Skeleton className="w-14 h-3 bg-gray-500" />
          <Skeleton className="w-20 h-3 bg-gray-500" />
        </div>
      </div>

      <div className="space-y-3 w-[250px]">
        <div className="overflow-hidden rounded-md">
          <Skeleton className="object-cover transition-all hover:scale-105 h-[330px] w-[250px] bg-gray-500" />
        </div>

        <div className="space-y-1 text-sm">
          <Skeleton className="w-14 h-3 bg-gray-500" />
          <Skeleton className="w-20 h-3 bg-gray-500" />
        </div>
      </div>

      <div className="space-y-3 w-[250px]">
        <div className="overflow-hidden rounded-md">
          <Skeleton className="object-cover transition-all hover:scale-105 h-[330px] w-[250px] bg-gray-500" />
        </div>

        <div className="space-y-1 text-sm">
          <Skeleton className="w-14 h-3 bg-gray-500" />
          <Skeleton className="w-20 h-3 bg-gray-500" />
        </div>
      </div>

      <div className="space-y-3 w-[250px]">
        <div className="overflow-hidden rounded-md">
          <Skeleton className="object-cover transition-all hover:scale-105 h-[330px] w-[250px] bg-gray-500" />
        </div>

        <div className="space-y-1 text-sm">
          <Skeleton className="w-14 h-3 bg-gray-500" />
          <Skeleton className="w-20 h-3 bg-gray-500" />
        </div>
      </div>
    </div>
  );
};
