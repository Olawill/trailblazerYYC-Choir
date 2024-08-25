"use client";

import { AlbumArtWork } from "@/components/music/album-artwork";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getAllMusicList,
  getAllPlay,
  getMusicListForSearchTerm,
} from "@/data/playlistData";
import { Playlist } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { BrowseSearch } from "./_components/browse-search";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useCurrentUser } from "@/hooks/use-current-user";

const BrowsePage = ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) => {
  const searchQuery = searchParams?.query;

  const user = useCurrentUser();

  const { data: playlists, isLoading: allLoading } = useQuery({
    queryKey: ["playlists"],
    queryFn: () => getAllPlay(),
  });

  const { data: allTrack, isLoading } = useQuery({
    queryKey: ["track", searchQuery],
    queryFn: () =>
      !searchQuery ? getAllMusicList() : getMusicListForSearchTerm(searchQuery),
  });

  const tracks = allTrack?.map((l) => {
    return {
      id: l.id,
      name: l.title.split(" - ")[0],
      cover: l.videoId
        ? `https://img.youtube.com/vi/${l.videoId}/0.jpg`
        : "/noWallpaper.jpg",
      videoId: l.videoId,
      artist: l.authors.map((a) => a.name).join(", "),
      isLiked: user ? l.favorite.includes(user?.id as string) : false,
      playlistIDs: l.playlistIDs,
      libraryIDs: l.libraryIDs,
      link: l.link,
    };
  });
  return (
    <div className="col-span-3 lg:col-span-4 border rounded-md">
      <div className="h-full w-full px-4 py-6 lg:px-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center md:justify-between">
          <h1 className="text-xl md:text-3xl font-bold">Browse</h1>

          <BrowseSearch placeholder="music list" />
        </div>

        {/* <div className="flex space-x-4 pb-4"> */}
        {isLoading && <BrowsePage.Skeleton />}
        {tracks?.length === 0 && (
          <Alert className="bg-transparent w-full">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Music Found</AlertTitle>
            <AlertDescription>
              🎵Looks like the playlist is on mute — no music found!🎵
            </AlertDescription>
          </Alert>
        )}

        <div className="grid sm:grid-cols-2 md:grid-cols-3 min-[1280px]:grid-cols-4 2xl:grid-cols-5 gap-4">
          <Suspense fallback={<BrowsePage.Skeleton />}>
            {tracks &&
              tracks.map((album) => (
                <AlbumArtWork
                  key={album.name}
                  album={album}
                  playlists={playlists as Playlist[]}
                  className="w-[310px] md:w-[200px]"
                  aspectRatio="portrait"
                  addToLibrary
                  addToPlaylist
                  removeFromLibrary={user?.role !== "USER"}
                  width={200}
                  height={330}
                />
              ))}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

BrowsePage.Skeleton = function AlbumSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 min-[1280px]:grid-cols-4 2xl:grid-cols-5 gap-4">
      <div className="space-y-3 w-[310px] md:w-[200px]">
        <div className="overflow-hidden rounded-md">
          <Skeleton className="object-cover transition-all hover:scale-105 h-[330px] w-full bg-gray-500" />
        </div>

        <div className="space-y-1 text-sm">
          <Skeleton className="w-14 h-3 bg-gray-500" />
          <Skeleton className="w-20 h-3 bg-gray-500" />
        </div>
      </div>

      <div className="space-y-3 w-[310px] md:w-[200px]">
        <div className="overflow-hidden rounded-md">
          <Skeleton className="object-cover transition-all hover:scale-105 h-[330px] w-full bg-gray-500" />
        </div>

        <div className="space-y-1 text-sm">
          <Skeleton className="w-14 h-3 bg-gray-500" />
          <Skeleton className="w-20 h-3 bg-gray-500" />
        </div>
      </div>

      <div className="space-y-3 w-[310px] md:w-[200px]">
        <div className="overflow-hidden rounded-md">
          <Skeleton className="object-cover transition-all hover:scale-105 h-[330px] w-full bg-gray-500" />
        </div>

        <div className="space-y-1 text-sm">
          <Skeleton className="w-14 h-3 bg-gray-500" />
          <Skeleton className="w-20 h-3 bg-gray-500" />
        </div>
      </div>

      <div className="space-y-3 w-[310px] md:w-[200px]">
        <div className="overflow-hidden rounded-md">
          <Skeleton className="object-cover transition-all hover:scale-105 h-[330px] w-full bg-gray-500" />
        </div>

        <div className="space-y-1 text-sm">
          <Skeleton className="w-14 h-3 bg-gray-500" />
          <Skeleton className="w-20 h-3 bg-gray-500" />
        </div>
      </div>

      <div className="space-y-3 w-[310px] md:w-[200px]">
        <div className="overflow-hidden rounded-md">
          <Skeleton className="object-cover transition-all hover:scale-105 h-[330px] w-full bg-gray-500" />
        </div>

        <div className="space-y-1 text-sm">
          <Skeleton className="w-14 h-3 bg-gray-500" />
          <Skeleton className="w-20 h-3 bg-gray-500" />
        </div>
      </div>

      <div className="space-y-3 w-[310px] md:w-[200px]">
        <div className="overflow-hidden rounded-md">
          <Skeleton className="object-cover transition-all hover:scale-105 h-[330px] w-full bg-gray-500" />
        </div>

        <div className="space-y-1 text-sm">
          <Skeleton className="w-14 h-3 bg-gray-500" />
          <Skeleton className="w-20 h-3 bg-gray-500" />
        </div>
      </div>

      <div className="space-y-3 w-[310px] md:w-[200px]">
        <div className="overflow-hidden rounded-md">
          <Skeleton className="object-cover transition-all hover:scale-105 h-[330px] w-full bg-gray-500" />
        </div>

        <div className="space-y-1 text-sm">
          <Skeleton className="w-14 h-3 bg-gray-500" />
          <Skeleton className="w-20 h-3 bg-gray-500" />
        </div>
      </div>

      <div className="space-y-3 w-[310px] md:w-[200px]">
        <div className="overflow-hidden rounded-md">
          <Skeleton className="object-cover transition-all hover:scale-105 h-[330px] w-full bg-gray-500" />
        </div>

        <div className="space-y-1 text-sm">
          <Skeleton className="w-14 h-3 bg-gray-500" />
          <Skeleton className="w-20 h-3 bg-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default BrowsePage;
