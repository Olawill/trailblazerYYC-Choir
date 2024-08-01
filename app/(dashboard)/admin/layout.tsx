import { Metadata } from "next";

import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/app/(dashboard)/settings/_components/sidebar-nav";
import { RoleGate } from "@/components/auth/role-gate";
import { UserRole } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

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
  {
    title: "Users",
    href: "/admin/manage-users",
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <RoleGate allowedRole={[UserRole.ADMIN]} onPage>
      <Suspense fallback={<AdminLayout.Skeleton />}>
        <div className="space-y-6 p-2 pb-16 md:block">
          <div className="space-y-0.5 w-full">
            <h2 className="text-2xl font-bold tracking-tight">
              Member Administration
            </h2>
            <p className="text-gray-300">
              Manage your members and keep track of the dues/expenses.
            </p>
          </div>
          <Separator className="my-6 w-[350px] sm:w-[550px] md:w-[650px] lg:w-[920px] xl:w-[1140px] 2xl:w-[1480px]" />
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-6 lg:space-y-0">
            <aside className="lg:w-1/5 pt-4">
              <SidebarNav items={sidebarNavItems} />
            </aside>
            <div
              className={`-ml-5 flex-1 dark:bg-gray-700 py-4 px-6 rounded-md`}
            >
              {children}
            </div>
          </div>
        </div>
      </Suspense>
    </RoleGate>
  );
}

AdminLayout.Skeleton = function AdminLayoutSkeleton() {
  return (
    <div className="mt-2 h-full w-[350px] sm:w-[600px] md:w-[650px] lg:w-[700px] xl:w-[900px] 2xl:w-[1250px]">
      <div className="flex flex-col gap-2 mt-4">
        <Skeleton className="h-10 w-48 bg-gray-500" />
        <Skeleton className="h-4 w-72 bg-gray-500 mb-2" />
      </div>
      <Skeleton className="w-full h-1 mt-2 mb-6 bg-gray-500" />

      <div className="flex flex-col gap-2 space-y-8 lg:flex-row lg:space-x-6 lg:space-y-0 w-full">
        <div className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 lg:w-1/5">
          <Skeleton className="w-32 lg:w-40 h-12 bg-gray-500" />
          <Skeleton className="w-32 lg:w-40 h-12 bg-gray-500" />
          <Skeleton className="w-32 lg:w-40 h-12 bg-gray-500" />
          <Skeleton className="w-32 lg:w-40 h-12 bg-gray-500" />
        </div>
        <Skeleton className="bg-gray-500 min-h-[750px] w-full lg:w-4/5" />
      </div>
    </div>
  );
};
