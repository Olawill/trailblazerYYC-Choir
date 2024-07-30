import { Header } from "@/components/music/header";

export default function Home() {
  return (
    <div className="h-full w-[350px] sm:w-[600px] md:w-[650px] lg:w-[700px] xl:w-[900px] 2xl:w-[1250px]">
      <Header label="Music" action="Add" />
      Home
    </div>
  );
}
