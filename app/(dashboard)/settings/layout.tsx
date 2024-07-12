import { Metadata } from "next";

import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "./_components/sidebar-nav";

export const metadata: Metadata = {
  title: "Settings Page",
  description: "Users manage their account setting here.",
};

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/settings",
  },
  {
    title: "Appearance",
    href: "/settings/appearance",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="space-y-6 p-10 pb-16 md:block">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-gray-300">
          Manage your account settings and set preferences.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div
          className={`flex-1 lg:max-w-6xl dark:bg-gray-700 bg-blue-300 py-4 px-12 rounded-md`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
