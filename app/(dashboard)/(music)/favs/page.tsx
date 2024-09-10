"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { BrowseSearch } from "../browse/_components/browse-search";
import {
  getAllPlay,
  getFavListForSearchTerm,
  getFavPlaylistMusic,
} from "@/data/playlistData";
import { useQuery } from "@tanstack/react-query";
import BrowsePage from "../browse/page";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Suspense } from "react";
import { AlbumArtWork } from "@/components/music/album-artwork";
import { Playlist } from "@prisma/client";

const FavsPage = ({
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

  const { data: favTracks, isLoading } = useQuery({
    queryKey: ["favTrack", searchQuery, user],
    queryFn: () =>
      !searchQuery && user
        ? getFavPlaylistMusic(user?.id as string)
        : getFavListForSearchTerm(searchQuery as string, user?.id as string),
  });

  const tracks = favTracks?.map((l) => {
    return {
      id: l.id,
      name: l.title.split(" - ")[0],
      cover: l.videoId
        ? `https://img.youtube.com/vi/${l.videoId}/0.jpg`
        : "/noWall.jpg",
      videoId: l.videoId,
      artist: l.artists,
      isLiked: user ? l.favorite.includes(user?.id as string) : false,
      playlistIDs: l.playlistIDs,
      libraryIDs: l.libraryIDs,
      link: l.link,
      contents: l.contents,
    };
  });

  return (
    <div className="col-span-3 lg:col-span-4 border rounded-md">
      <div className="h-full w-full px-4 py-6 lg:px-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center md:justify-between">
          <h1 className="text-3xl font-bold">Favorite List</h1>
          <BrowseSearch placeholder="favorite list" />
        </div>

        {isLoading && <BrowsePage.Skeleton />}
        {tracks?.length === 0 && (
          <Alert className="bg-transparent w-full">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Music Found</AlertTitle>
            <AlertDescription>
              🎵 Looks like we&apos;re out of tunes — this playlist&apos;s
              feeling a bit off-key! 🎵
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

export default FavsPage;
