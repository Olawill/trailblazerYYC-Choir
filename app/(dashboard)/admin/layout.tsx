import { Metadata } from "next";

import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/app/(dashboard)/settings/_components/sidebar-nav";

export const metadata: Metadata = {
  title: "Membership Admin Page",
  description: "Used to manage members and member details.",
};

const sidebarNavItems = [
  {
    title: "Manage",
    href: "/admin",
  },
  {
    title: "Payments & Expense",
    href: "/admin/manage-finance",
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="space-y-6 p-10 pb-16 md:block">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">
          Member Administration
        </h2>
        <p className="text-gray-300">
          Manage your members and keep track of the dues/expenses.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-6 lg:space-y-0">
        <aside className="lg:w-1/5 pt-4">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div
          className={`-ml-5 flex-1 lg:max-w-6xl dark:bg-gray-700 py-4 px-6 rounded-md`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
