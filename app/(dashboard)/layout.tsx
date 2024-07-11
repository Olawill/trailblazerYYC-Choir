import DesktopNavbar from "@/components/navbar/desktop-navbar";
import MobileNavbar from "@/components/navbar/mobile-navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full w-full flex flex-col items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
      <MobileNavbar />
      <DesktopNavbar />
      <div>{children}</div>
    </div>
  );
};

export default DashboardLayout;
