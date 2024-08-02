import { Header } from "@/components/music/header";
import { MusicSidebar, playlists } from "@/components/music/music-sidebar";

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
              <div className="h-full px-4 py-6 lg:px-8">Main</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
