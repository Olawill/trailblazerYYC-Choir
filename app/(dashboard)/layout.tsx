import DesktopNavbar from "@/components/navbar/desktop-navbar";
import MobileNavbar from "@/components/navbar/mobile-navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-radial from-sky-400 from-0% to-blue-800 to-100%">
      <MobileNavbar />
      <DesktopNavbar />
      <div className="px-4 py-6 max-w-6xl 2xl:max-w-(--breakpoint-2xl) mx-auto ">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
