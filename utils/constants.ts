import {
  getRecentlyAdded,
  getRecentlyPlayed,
  getTopSongs,
} from "@/data/playlistData";

export type PlaylistFunction = {
  "Top Songs": () => Promise<
    | {
        title: string;
        id: string;
        videoId: string | null;
        artists: string;
        playlistIDs: string[];
        favorite: string[];
      }[]
    | null
  >;
  "Recently Added"?: () => Promise<
    | {
        title: string;
        id: string;
        videoId: string | null;
        artists: string;
        playlistIDs: string[];
        favorite: string[];
      }[]
    | null
  >;
  "Recently Played"?: () => Promise<
    | {
        title: string;
        id: string;
        videoId: string | null;
        artists: string;
        playlistIDs: string[];
        favorite: string[];
      }[]
    | null
  >;
  [key: string]: (() => Promise<any[] | null>) | undefined; // Added index signature
};

export const allQuery = [
  "members",
  "active",
  "allMembers",
  "users",
  "playlists",
  "listen",
  "allMusics",
  "currentMusics",
  "track",
  "favTrack",
  "library",
  "listMusic",
];

export const genericPlaylistFunction: PlaylistFunction = {
  "Top Songs": () => getTopSongs(),
  "Recently Added": () => getRecentlyAdded(),
  "Recently Played": () => getRecentlyPlayed(),
};

export const DUE = 10;
