"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

import { X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { getPlaylistInfo } from "@/data/playlistData";
import { useCurrentUser } from "@/hooks/use-current-user";
import Image from "next/image";
import { ContentType } from "@prisma/client";
import { changeMusicStatus } from "@/actions/music-update";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { YoutubePlayer } from "./youtube-player";
import { MusicPlayer } from "./music-player";
import { Howl } from "howler";
import { ScaleLoader } from "react-spinners";

type MusicPlayerHandle = {
  stop: () => void;
};

type CurrentAlbumType = {
  id: string;
  name: string;
  cover: string;
  videoId: string | null;
  artist: string;
  isLiked: boolean;
  contents: {
    id: string;
    content: string;
    type: ContentType;
  }[];
};

interface PlaylistPlayAllDrawerProps {
  playlistId: string;
  playlistDrawerOpen: boolean;
  setPlaylistDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

export const PlaylistPlayAllDrawer = ({
  playlistId,
  playlistDrawerOpen,
  setPlaylistDrawerOpen,
}: PlaylistPlayAllDrawerProps) => {
  const user = useCurrentUser();

  const sound = new Howl({
    // src: ["behrakha.mp3"],
    src: [
      "https://res.cloudinary.com/dy5p79uwl/video/upload/v1724853630/yyc/nw4dgwl7lexrphevhpis.mp3",
    ],
    html5: true,
  });

  const [currentAlbum, setCurrentAlbum] = useState<CurrentAlbumType | null>(
    null
  );

  const musicPlayerRef = useRef<MusicPlayerHandle>(null);

  const handleDrawerOpenChange = (open: boolean) => {
    if (!open && musicPlayerRef.current) {
      musicPlayerRef.current.stop(); // Stop music when drawer closes
    }
    setPlaylistDrawerOpen(open);
  };

  // PLAYLIST TRACKS AND DATA
  const { data: playlistData, isLoading } = useQuery({
    queryKey: ["allPlaylistTracks", playlistId],
    queryFn: () => getPlaylistInfo(playlistId as string),
  });

  const modifiedPlaylistData = useMemo(() => {
    return playlistData?.music?.map((l) => {
      return {
        id: l.id,
        name: l.title.split(" - ")[0],
        cover: l.videoId
          ? `https://img.youtube.com/vi/${l.videoId}/0.jpg`
          : "/noWallpaper.jpg",
        videoId: l.videoId,
        artist: l.authors.map((a) => a.name).join(", "),
        isLiked: user ? l.favorite.includes(user?.id as string) : false,
        contents: l.contents,
      };
    });
  }, [playlistData, user]);

  useEffect(() => {
    if (modifiedPlaylistData && modifiedPlaylistData.length > 0)
      setCurrentAlbum(modifiedPlaylistData[0]);
  }, [modifiedPlaylistData]);

  const handleClick = async (id: string, musicId: string) => {
    await changeMusicStatus(id, musicId);
  };

  return (
    <>
      {isLoading ? (
        <ScaleLoader color="white" />
      ) : (
        <Drawer open={playlistDrawerOpen} onOpenChange={handleDrawerOpenChange}>
          <DrawerContent className="h-[95%] md:h-4/5 bg-sky-500 border-none">
            <DrawerHeader className="text-right">
              <DrawerTitle className="ml-auto -mt-6">
                <DrawerClose asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-none hover:bg-transparent focus-visible:ring-px bg-transparent -mr-4"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </DrawerClose>
              </DrawerTitle>
              <DrawerDescription className="sr-only">
                Playlist Lyrics and Youtube Links.
              </DrawerDescription>
            </DrawerHeader>

            {/* LARGE SCREENS */}
            <div className="hidden md:flex gap-8 space-y-3 px-4">
              <div className="flex flex-col gap-4">
                <h2 className="ml-2 text-2xl font-semibold tracking-tight">
                  {playlistData?.name}
                </h2>
                <ScrollArea className="h-[500px] px-3">
                  <div className="flex flex-col gap-4">
                    {modifiedPlaylistData?.map((item, index) => (
                      <div
                        className={`flex gap-4 cursor-pointer hover:bg-background rounded-md px-2 ${
                          item.id === currentAlbum?.id && "bg-background"
                        }`}
                        onClick={() => {
                          if (musicPlayerRef.current) {
                            musicPlayerRef.current.stop();
                          }
                          setCurrentAlbum(item);
                        }}
                        key={index}
                      >
                        <div className="relative overflow-hidden h-20 w-20 rounded-full">
                          <Image
                            src={item.cover}
                            alt={item.name}
                            fill
                            sizes="100%"
                            priority
                            className={cn(
                              "object-cover transition-all hover:scale-105",
                              "aspect-[3/4]"
                            )}
                          />
                        </div>
                        <div className="flex-1 flex justify-between gap-2">
                          <div className="flex-1 space-y-1 text-sm mt-2">
                            <h3 className="font-medium leading-none">
                              {item.name}
                            </h3>
                            <p className="text-xs text-gray-300">
                              {item.artist}
                            </p>
                          </div>
                          {user && (
                            <Star
                              className={`h-4 w-4 mt-2 cursor-pointer ${
                                item.isLiked ? "text-red-500" : "text-gray-300"
                              }`}
                              fill={item.isLiked ? "red" : "transparent"}
                              onClick={() =>
                                handleClick(
                                  user?.id as string,
                                  item.id as string
                                )
                              }
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-8">
                <ScrollArea className="col-span-1 max-h-[600px] w-full border rounded-md p-2">
                  <h2 className="italic uppercase font-semibold text-sm mb-2">
                    Lyrics
                  </h2>
                  {currentAlbum &&
                    currentAlbum?.contents &&
                    currentAlbum?.contents?.map((content, index) => {
                      if (index < currentAlbum?.contents?.length! - 1) {
                        return (
                          <div
                            className="bg-sky-200 dark:bg-background text-sm p-2 rounded-sm mb-2"
                            key={index}
                          >
                            <h4 className="italic uppercase font-semibold text-xs mb-1 bg-gray-300 p-1 rounded-md">
                              {content?.type as string}
                            </h4>
                            <p className="whitespace-pre-wrap">
                              {content?.content as string}
                            </p>
                          </div>
                        );
                      } else {
                        return (
                          <div
                            className="bg-sky-200 dark:bg-background text-sm p-2 rounded-sm"
                            key={index}
                          >
                            <h4 className="italic uppercase font-semibold text-xs mb-1 bg-gray-300 p-1 rounded-md">
                              {content?.type as string}
                            </h4>
                            <p className="whitespace-pre-wrap">
                              {content?.content as string}
                            </p>
                          </div>
                        );
                      }
                    })}
                </ScrollArea>

                <div className="col-span-1 relative h-[600px] w-full overflow-hidden rounded-md">
                  {currentAlbum?.videoId ? (
                    <YoutubePlayer album={currentAlbum} />
                  ) : (
                    <MusicPlayer
                      title={currentAlbum?.name as string}
                      id={currentAlbum?.id as string}
                      sound={sound}
                      ref={musicPlayerRef}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* MOBILE SCREENS */}
            <div className="md:hidden space-y-3 cursor pointer px-4 -mt-4">
              <h2 className="ml-2 text-2xl font-semibold tracking-tight">
                {playlistData?.name}
              </h2>
              <ScrollArea className="h-[300px] border rounded-md p-2">
                <div className="flex flex-col gap-2">
                  {modifiedPlaylistData?.map((item, index) => (
                    <div
                      className={`flex gap-4 cursor-pointer hover:bg-background rounded-md p-2 ${
                        item.id === currentAlbum?.id && "bg-background"
                      }`}
                      onClick={() => {
                        if (musicPlayerRef.current) {
                          musicPlayerRef.current.stop();
                        }
                        setCurrentAlbum(item);
                      }}
                      key={index}
                    >
                      <div className="relative overflow-hidden h-10 w-10 rounded-full">
                        <Image
                          src={item.cover}
                          alt={item.name}
                          fill
                          sizes="100%"
                          priority
                          className={cn(
                            "object-cover transition-all hover:scale-105",
                            "aspect-[3/4]"
                          )}
                        />
                      </div>
                      <div className="flex-1 flex justify-between">
                        <div className="flex-1 space-y-1 text-sm mt-2">
                          <h3 className="font-medium leading-none">
                            {item.name}
                          </h3>
                          <p className="text-xs text-gray-300">{item.artist}</p>
                        </div>
                        {user && (
                          <Star
                            className={`h-5 w-5 cursor-pointer mt-2 ${
                              item.isLiked ? "text-red-500" : "text-gray-300"
                            }`}
                            fill={item.isLiked ? "red" : "transparent"}
                            onClick={() =>
                              handleClick(user?.id as string, item.id as string)
                            }
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <ScrollArea className="h-[500px] border rounded-md p-2">
                <h2 className="italic uppercase font-semibold text-sm mb-2">
                  Lyrics
                </h2>
                {currentAlbum &&
                  currentAlbum.contents &&
                  currentAlbum?.contents?.map((content, index) => {
                    if (index < currentAlbum?.contents?.length! - 1) {
                      return (
                        <div
                          className="bg-sky-200 dark:bg-background text-sm p-2 rounded-sm mb-2"
                          key={index}
                        >
                          <h4 className="italic uppercase font-semibold text-xs mb-1 bg-gray-300 p-1 rounded-md">
                            {content?.type as string}
                          </h4>
                          <p className="whitespace-pre-wrap">
                            {content?.content as string}
                          </p>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          className="bg-sky-200 dark:bg-background text-sm p-2 rounded-sm"
                          key={index}
                        >
                          <h4 className="italic uppercase font-semibold text-xs mb-1 bg-gray-300 p-1 rounded-md">
                            {content?.type as string}
                          </h4>
                          <p className="whitespace-pre-wrap">
                            {content?.content as string}
                          </p>
                        </div>
                      );
                    }
                  })}

                <div className="relative h-72 w-full overflow-hidden rounded-md mt-2">
                  {currentAlbum?.videoId ? (
                    <YoutubePlayer album={currentAlbum} />
                  ) : (
                    <MusicPlayer
                      title={currentAlbum?.name as string}
                      id={currentAlbum?.id as string}
                      sound={sound}
                      ref={musicPlayerRef}
                    />
                  )}
                </div>
              </ScrollArea>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};
