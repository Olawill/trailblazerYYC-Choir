"use client";

import { LogIn, LogOut, Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { menus } from "@/data/menus";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { publicRoutes } from "../../routes";
import Image from "next/image";
import { usePathname } from "next/navigation";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const DesktopNavbar = () => {
  const pathName = usePathname();

  // console.log(pathName);

  const session = useSession();

  return (
    <div
      className={`hidden sticky top-0 bg-slate-200 p-4 space-y-1 md:flex items-center justify-between`}
    >
      <div className="w-full flex items-center justify-between">
        <div className="flex flex-col gap-y-4 items-start justify-center">
          <h1 className={cn("text-3xl font-semibold", poppins.className)}>
            TrailBlazer YYC 🎶
          </h1>
        </div>

        <div className="flex gap-4 items-center justify-center">
          {menus.map((menu, i) =>
            publicRoutes.includes(menu.url) ? (
              <Link
                href={menu.url}
                key={i}
                className={`text-xl font-semibold text-slate-600 hover:font-bold hover:text-slate-500 py-4 ${
                  pathName === menu.url && "text-blue-400 hover:text-blue-600"
                } flex items-center`}
              >
                {menu.icon} {menu.label}
              </Link>
            ) : (
              session.status === "authenticated" &&
              menu.allowedUsers.includes(session.data.user.role) && (
                <Link
                  href={menu.url}
                  key={i}
                  className={`w-full text-xl font-semibold text-slate-600 hover:font-bold hover:text-slate-500 py-4 ${
                    pathName === menu.url && "text-blue-400 hover:text-blue-600"
                  } flex items-center`}
                >
                  {menu.icon} {menu.label}
                </Link>
              )
            )
          )}
        </div>

        <div className="flex items-center justify-center gap-2">
          {session.status === "authenticated" ? (
            <div className="flex items-center justify-center gap-2">
              <Button
                size="sm"
                onClick={async () => await signOut()}
                className="text-xl text-white font-semibold hover:font-bold hover:bg-destructive py-4"
              >
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>

              <Link href="/settings" className="w-16 h-16 flex items-center">
                <Image
                  src={session.data.user.image || "/noAvatar.jpg"}
                  alt="avatar"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full"
                />
              </Link>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={async () => await signIn()}
              className="text-xl text-white font-semibold hover:font-bold hover:bg-blue-400 py-4"
            >
              <LogIn className="w-4 h-4 mr-2" /> Login
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesktopNavbar;
