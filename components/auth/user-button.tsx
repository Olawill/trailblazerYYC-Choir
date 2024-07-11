"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { CircleUserRound, LogOut, Wrench } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogoutButton } from "./logout-button";
import { useRouter } from "next/navigation";

const UserButton = () => {
  const router = useRouter();

  const user = useCurrentUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="border-px outline-none">
        <Avatar className="relative">
          <AvatarImage src={user?.image || ""} alt="avatar" />
          <AvatarFallback className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
            <CircleUserRound className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 bg-blue-400 border-px" align="end">
        <DropdownMenuItem
          className="font-semibold cursor-pointer"
          onClick={() => router.push("/settings")}
        >
          <Wrench className="w-4 h-4 mr-2" /> Settings
        </DropdownMenuItem>
        <LogoutButton>
          <DropdownMenuItem className="font-semibold cursor-pointer hover:text-white hover:bg-destructive">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
