"use client";

import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { useState } from "react";
import { menus } from "@/data/menus";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { publicRoutes } from "@/routes";
import { usePathname } from "next/navigation";
import UserButton from "@/components/auth/user-button";
import LoginButton from "../auth/login-button";
import { LogoutButton } from "../auth/logout-button";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const MobileNavbar = () => {
  const [open, setOpen] = useState(false);

  const pathName = usePathname();

  const session = useSession();

  return (
    <div className="w-full sticky top-0 bg-blue-300 p-4 space-y-1 md:hidden rounded-b-md shadow-md">
      <div className="flex items-center justify-between">
        <div className="w-full flex flex-col gap-y-4 items-start justify-center">
          <h1 className={cn("text-2xl font-semibold", poppins.className)}>
            TrailBlazer YYC 🎶
          </h1>
        </div>

        <div className="flex items-center justify-center gap-2">
          {session.status === "authenticated" && <UserButton />}
          {open ? (
            <X
              className={`w-6 h-6 transition-opacity duration-300 ${
                open ? "opacity-100" : "opacity-0"
              }`}
              onClick={() => setOpen((prev) => !prev)}
            />
          ) : (
            <Menu
              className={`w-6 h-6 transition-opacity duration-300 ${
                open ? "opacity-0" : "opacity-100"
              }`}
              onClick={() => setOpen((prev) => !prev)}
            />
          )}
        </div>
      </div>

      {open && (
        <div className="fixed bg-blue-200 top-[72px] left-0 right-0 bottom-0 z-10 flex flex-col items-center justify-center">
          <div className="w-[90%] flex flex-col gap-2 items-center justify-center">
            {menus.map((menu, i) =>
              publicRoutes.includes(menu.url) ? (
                <Link
                  href={menu.url}
                  key={i}
                  onClick={() => setOpen((prev) => !prev)}
                  className={`w-full text-center text-2xl font-semibold text-slate-600 hover:font-bold hover:text-slate-500 hover:bg-slate-200 py-4 rounded-md ${
                    pathName === menu.url && "text-blue-400 hover:text-blue-600"
                  }`}
                >
                  {menu.label}
                </Link>
              ) : (
                session.status === "authenticated" &&
                menu.allowedUsers.includes(session.data.user.role) && (
                  <Link
                    href={menu.url}
                    key={i}
                    onClick={() => setOpen((prev) => !prev)}
                    className={`w-full text-center text-2xl font-semibold text-slate-600 hover:font-bold hover:text-slate-500 hover:bg-slate-200 py-4 rounded-md ${
                      pathName === menu.url &&
                      "text-blue-400 hover:text-blue-600"
                    }`}
                  >
                    {menu.label}
                  </Link>
                )
              )
            )}

            {session.status === "authenticated" ? (
              <LogoutButton>
                <Button
                  variant="ghost"
                  className="w-full text-center text-2xl no-underline font-semibold text-slate-600 hover:font-bold hover:text-slate-500 hover:bg-slate-200 py-8 rounded-md"
                >
                  Logout
                </Button>
              </LogoutButton>
            ) : (
              <LoginButton>
                <Button
                  variant="ghost"
                  className="w-full text-center text-2xl no-underline font-semibold text-slate-600 hover:font-bold hover:text-slate-500 hover:bg-slate-200 py-8 rounded-md"
                >
                  Login
                </Button>
              </LoginButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNavbar;
