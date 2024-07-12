import { FileMusic, HandCoins, UsersRound, Cog } from "lucide-react";

export const menus = [
  {
    label: "Music",
    url: "/",
    allowedUsers: ["USER", "SUPERUSER", "ADMIN"],
    icon: FileMusic,
  },
  {
    label: "Members",
    url: "/members",
    allowedUsers: ["SUPERUSER", "ADMIN"],
    icon: UsersRound,
  },
  {
    label: "Finance",
    url: "/finance",
    allowedUsers: ["SUPERUSER", "ADMIN"],
    icon: HandCoins,
  },
  {
    label: "Admin",
    url: "/admin",
    allowedUsers: ["ADMIN"],
    icon: Cog,
  },
];
