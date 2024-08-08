"use client";

import { AlbumArtWork } from "@/components/music/album-artwork";
import { listenNowAlbums, madeForYouAlbums } from "@/components/music/cc";
import { Header } from "@/components/music/header";
import { MusicSidebar } from "@/components/music/music-sidebar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllPlay, getCurrentList } from "@/data/playlistData";

import { useCurrentUser } from "@/hooks/use-current-user";

import { Playlist } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Suspense } from "react";

export default function Home() {
  const user = useCurrentUser();

  const qC = useQueryClient();

  const { data: playlists, isLoading } = useQuery({
    queryKey: ["playlists"],
    queryFn: () => getAllPlay(),
  });

  const { data: listenNow, isLoading: listenLoading } = useQuery({
    queryKey: ["listen"],
    queryFn: () => getCurrentList(),
  });

  const modlistenNow = listenNow?.map((l) => {
    return {
      id: l.id,
      name: l.title,
      cover: `https://img.youtube.com/vi/${l.videoId}/0.jpg`,
      artist: l.authors.map((a) => a.name).join(", "),
    };
  });

  return (
    <div className="h-full w-[350px] sm:w-[500px] md:w-[650px] lg:w-[850px] xl:w-[1110px] 2xl:w-[1450px]">
      <Header label="Music" action="Add" />

      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5">
          <MusicSidebar
            playlists={playlists as Playlist[]}
            className="hidden lg:block col-span-1"
            loading={isLoading}
          />

          <div className="col-span-3 lg:col-span-4 border rounded-md">
            <div className="h-full w-full px-4 py-6 lg:px-8 space-y-4">
              <div id="listen-now">
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold tracking-light">
                    Listen Now
                  </h2>
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
                        <Suspense fallback={<Home.Skeleton />}>
                          {madeForYouAlbums.map((album) => (
                            <AlbumArtWork
                              key={album.name}
                              playlists={playlists as Playlist[]}
                              album={album}
                              className="w-[250px]"
                              aspectRatio="portrait"
                              width={250}
                              height={330}
                            />
                          ))}
                        </Suspense>
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                </div>
              )}

              <div className="lg:hidden">
                {playlists &&
                  playlists.map((playlist, index) => (
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
                            <Suspense fallback={<Home.Skeleton />}>
                              {madeForYouAlbums.map((album) => (
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
                            </Suspense>
                          </div>
                          <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
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
