"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useCurrentUser } from "@/hooks/use-current-user";
import { CircleUserRound, LogOut, Wrench } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { LogoutButton } from "./logout-button";

type UserButtonProp = {
  setMenuOpen?: Dispatch<SetStateAction<boolean>>;
};

const UserButton = ({ setMenuOpen }: UserButtonProp) => {
  const router = useRouter();

  const user = useCurrentUser();

  // Close the menu if it is open
  const handleClick = () => {
    if (setMenuOpen) setMenuOpen(false);
  };

  return (
    <DropdownMenu onOpenChange={handleClick}>
      <DropdownMenuTrigger className="border-px outline-none">
        <Avatar className="relative">
          <AvatarImage src={user?.image || ""} alt="avatar" />
          <AvatarFallback className="bg-radial from-sky-400 from-0% to-blue-800 to-100%">
            <CircleUserRound className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 bg-blue-400 border-px" align="end">
        <DropdownMenuItem className="font-semibold flex gap-2">
          <Avatar className="relative">
            <AvatarImage src={user?.image || ""} alt="avatar" />
            <AvatarFallback className="bg-radial from-sky-400 from-0% to-blue-800 to-100%">
              <CircleUserRound className="text-white" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1 items-start">
            <span className="text-gray-700">{user?.name}</span>
            <span className="text-gray-500 text-xs truncate">
              {user?.email}
            </span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="font-semibold cursor-pointer"
          onClick={() => router.push("/settings")}
        >
          <Wrench className="w-4 h-4 mr-2" /> Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
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
