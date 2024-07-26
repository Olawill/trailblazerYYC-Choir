"use client";

import { LogIn, LogOut, Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { useState } from "react";
import { menus } from "@/data/menus";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { publicRoutes } from "@/routes";
import { usePathname, useRouter } from "next/navigation";
import UserButton from "@/components/auth/user-button";
import LoginButton from "@/components/auth/login-button";
import { LogoutButton } from "@/components/auth/logout-button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "../ui/separator";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const MobileNavbar = () => {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const pathName = usePathname();

  const session = useSession();

  return (
    <div className="w-full sticky top-0 z-50 bg-blue-300 p-4 space-y-1 lg:hidden rounded-b-md shadow-md">
      <div className="flex items-center justify-between">
        <div
          className="w-full flex flex-col gap-y-4 items-start justify-center cursor-pointer"
          onClick={() => {
            setOpen(false);
            router.push("/");
          }}
        >
          <h1 className={cn("text-2xl font-semibold", poppins.className)}>
            TrailBlazer YYC 🎶
          </h1>
        </div>

        {session.status === "authenticated" && (
          <div className="flex items-center justify-center gap-2">
            <UserButton setMenuOpen={setOpen} />
          </div>
        )}

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="hover:bg-transparent">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full bg-blue-200">
            <SheetHeader>
              <SheetTitle>
                <h1
                  className={cn(
                    "text-2xl text-center font-semibold",
                    poppins.className
                  )}
                >
                  TrailBlazer YYC 🎶
                </h1>
              </SheetTitle>
            </SheetHeader>
            <Separator className="my-4 bg-gray-400" />

            <div className=" flex flex-col gap-2 items-center justify-center">
              {menus.map((menu, i) =>
                publicRoutes.includes(menu.url) ? (
                  <Link
                    href={menu.url}
                    key={i}
                    onClick={() => setOpen((prev) => !prev)}
                    className={`w-full text-center text-2xl font-semibold text-slate-600 hover:font-bold hover:text-slate-500 ${
                      pathName === menu.url
                        ? "bg-blue-400 hover:text-white hover:bg-blue-700"
                        : "hover:bg-slate-200"
                    } py-4 rounded-md flex items-center justify-start px-2`}
                  >
                    <menu.icon className="mr-2 w-6 h-6" />
                    {menu.label}
                  </Link>
                ) : (
                  session.status === "authenticated" &&
                  menu.allowedUsers.includes(session.data.user.role) && (
                    <Link
                      href={menu.url}
                      key={i}
                      onClick={() => setOpen((prev) => !prev)}
                      className={`w-full text-center text-2xl font-semibold text-slate-600 hover:font-bold hover:text-slate-500 ${
                        pathName === menu.url
                          ? "bg-blue-400 hover:text-white hover:bg-blue-700"
                          : "hover:bg-slate-200"
                      } py-4 rounded-md flex items-center justify-start px-2`}
                    >
                      <menu.icon className="mr-2 w-6 h-6" />
                      {menu.label}
                    </Link>
                  )
                )
              )}

              {session.status === "authenticated" ? (
                <LogoutButton>
                  <Button
                    variant="ghost"
                    className="w-full text-2xl no-underline font-semibold text-slate-600 hover:font-bold hover:text-slate-500 hover:bg-slate-200 py-8 rounded-md flex items-center justify-start px-2"
                  >
                    <LogOut className="w-6 h-6 mr-2" /> Logout
                  </Button>
                </LogoutButton>
              ) : (
                <LoginButton>
                  <Button
                    variant="ghost"
                    className="w-full text-center text-2xl no-underline font-semibold text-slate-600 hover:font-bold hover:text-slate-500 hover:bg-slate-200 py-8 rounded-md flex items-center justify-start px-2"
                  >
                    <LogIn className="w-6 h-6 mr-2" /> Login
                  </Button>
                </LoginButton>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileNavbar;
