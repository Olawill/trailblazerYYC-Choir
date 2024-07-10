import { FileMusic, HandCoins, UsersRound, Cog } from "lucide-react";

export const menus = [
  {
    label: "Music",
    url: "/",
    allowedUsers: ["USER", "SUPERUSER", "ADMIN"],
    icon: <FileMusic className="w-4 h-4 mr-2" />,
  },
  {
    label: "Members",
    url: "/members",
    allowedUsers: ["SUPERUSER", "ADMIN"],
    icon: <UsersRound className="w-4 h-4 mr-2" />,
  },
  {
    label: "Member Dues",
    url: "/member-dues",
    allowedUsers: ["SUPERUSER", "ADMIN"],
    icon: <HandCoins className="w-4 h-4 mr-2" />,
  },
  {
    label: "Admin",
    url: "/admin",
    allowedUsers: ["ADMIN"],
    icon: <Cog className="w-4 h-4 mr-2" />,
  },
];
