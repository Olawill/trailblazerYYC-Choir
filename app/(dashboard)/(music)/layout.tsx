import { Header } from "@/components/music/header";
import { MusicSidebar } from "@/components/music/music-sidebar";

interface MusicLayoutProps {
  children: React.ReactNode;
}

export default async function MusicLayout({ children }: MusicLayoutProps) {
  return (
    <div className="h-full w-[350px] sm:w-[500px] md:w-[650px] lg:w-[850px] xl:w-[1110px] 2xl:w-[1450px]">
      <Header label="Music" action="Add" />

      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5">
          <MusicSidebar className="hidden lg:block col-span-1" />

          {children}
        </div>
      </div>
    </div>
  );
}
