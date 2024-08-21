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
  },
  {
    label: "Browse",
    url: "/browse",
    allowedUsers: ["USER", "SUPERUSER", "ADMIN"],
    icon: FolderSearch,
  },
  {
    label: "Favorites",
    url: "/favs",
    allowedUsers: ["USER", "SUPERUSER", "ADMIN"],
    icon: FolderHeart,
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
