import {
  FileMusic,
  HandCoins,
  UsersRound,
  Cog,
  FolderHeart,
  FolderSearch,
} from "lucide-react";

export const menus = [
  {
    label: "Music",
    url: "/",
    allowedUsers: ["USER", "SUPERUSER", "ADMIN"],
    icon: FileMusic,
    mobile: false,
  },
  {
    label: "Browse",
    url: "/browse",
    allowedUsers: ["USER", "SUPERUSER", "ADMIN"],
    icon: FolderSearch,
    mobile: true,
  },
  {
    label: "Favorites",
    url: "/favs",
    allowedUsers: ["USER", "SUPERUSER", "ADMIN"],
    icon: FolderHeart,
    mobile: true,
  },
  {
    label: "Members",
    url: "/members",
    allowedUsers: ["SUPERUSER", "ADMIN"],
    icon: UsersRound,
    mobile: false,
  },
  {
    label: "Finance",
    url: "/finance",
    allowedUsers: ["SUPERUSER", "ADMIN"],
    icon: HandCoins,
    mobile: false,
  },
  {
    label: "Admin",
    url: "/admin",
    allowedUsers: ["ADMIN"],
    icon: Cog,
    mobile: false,
  },
];
