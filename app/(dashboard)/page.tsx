import { AlbumArtWork } from "@/components/music/album-artwork";
import { listenNowAlbums, madeForYouAlbums } from "@/components/music/cc";
import { Header } from "@/components/music/header";
import { MusicSidebar, playlists } from "@/components/music/music-sidebar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="h-full w-[350px] sm:w-[500px] md:w-[650px] lg:w-[850px] xl:w-[1110px] 2xl:w-[1450px]">
      <Header label="Music" action="Add" />

      <div className="hidden md:block">
        <div className="">
          <div className="grid lg:grid-cols-5">
            <MusicSidebar
              playlists={playlists}
              className="hidden lg:block col-span-1"
            />

            <div className="col-span-3 lg:col-span-4">
              <div className="h-full px-4 py-6 lg:px-8 space-y-4">
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
                        {listenNowAlbums.map((album) => (
                          <AlbumArtWork
                            key={album.name}
                            album={album}
                            className="w-[250px]"
                            aspectRatio="portrait"
                            width={250}
                            height={330}
                          />
                        ))}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                </div>

                <div id="made-for-you">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-light">
                      Made For You
                    </h2>
                    <p className="text-sm text-gray-300">
                      Your Personal Palylist. Updated Daily.
                    </p>
                  </div>
                  <Separator className="my-4" />
                  <div className="relative">
                    <ScrollArea>
                      <div className="flex space-x-4 pb-4">
                        {madeForYouAlbums.map((album) => (
                          <AlbumArtWork
                            key={album.name}
                            album={album}
                            className="w-[250px]"
                            aspectRatio="portrait"
                            width={250}
                            height={330}
                          />
                        ))}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
