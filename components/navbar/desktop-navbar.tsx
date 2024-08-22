"use client";

import { LogIn } from "lucide-react";

import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { menus } from "@/data/menus";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { publicRoutes } from "@/routes";

import { usePathname, useRouter } from "next/navigation";
import UserButton from "@/components/auth/user-button";
import LoginButton from "../auth/login-button";
import { Skeleton } from "@/components/ui/skeleton";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const DesktopNavbar = () => {
  const pathName = usePathname();
  const router = useRouter();

  const session = useSession();

  return (
    <div
      className={`hidden w-full sticky top-0 z-50 bg-blue-300 p-4 space-y-1 lg:flex items-center justify-between rounded-b-md shadow-md`}
    >
      <div className="w-full flex items-center justify-between">
        <div
          className="flex flex-col gap-y-4 items-start justify-center cursor-pointer"
          onClick={() => router.push("/")}
        >
          <h1 className={cn("text-3xl font-semibold", poppins.className)}>
            TrailBlazer YYC 🎶
          </h1>
        </div>

        <div className="flex gap-4 items-center justify-center">
          {menus.map((menu, i) =>
            publicRoutes.includes(menu.url) && !menu.mobile ? (
              <Button
                key={i}
                asChild
                variant={pathName === menu.url ? "default" : "outline"}
                className="border-px"
              >
                <Link
                  href={menu.url}
                  className={`text-xl font-semibold ${
                    menu.url === pathName ? "bg-slate-600" : "bg-transparent"
                  } hover:font-bold py-4 flex items-center`}
                >
                  <menu.icon className="mr-2 w-4 h-4" /> {menu.label}
                </Link>
              </Button>
            ) : (
              session.status === "authenticated" &&
              menu.allowedUsers.includes(session.data.user.role) &&
              !menu.mobile && (
                <Button
                  key={i}
                  asChild
                  variant={pathName === menu.url ? "default" : "outline"}
                  className="border-px"
                >
                  <Link
                    href={menu.url}
                    className={`text-xl font-semibold ${
                      menu.url === pathName ? "bg-slate-600" : "bg-transparent"
                    } hover:font-bold py-4 flex items-center`}
                  >
                    <menu.icon className="mr-2 w-4 h-4" /> {menu.label}
                  </Link>
                </Button>
              )
            )
          )}
        </div>

        <div className="flex items-center justify-center gap-2">
          {session.status === "authenticated" ? (
            <div className="flex items-center justify-center gap-2">
              <UserButton />
            </div>
          ) : session.status === "loading" ? (
            <Skeleton className="py-4 w-32 bg-slate-500" />
          ) : (
            <LoginButton>
              <Button
                size="sm"
                className="text-xl font-semibold hover:font-bold hover:text-white hover:bg-blue-700 py-4"
              >
                <LogIn className="w-4 h-4 mr-2" /> Login
              </Button>
            </LoginButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesktopNavbar;
