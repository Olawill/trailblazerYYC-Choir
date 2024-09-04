import {
  getRecentlyAdded,
  getRecentlyPlayed,
  getTopSongs,
} from "@/data/playlistData";
import { Howl } from "howler";

export type PlaylistFunction = {
  "Top Songs": () => Promise<{
    playlistId?: string;
    canAddTo?: boolean;
    data: {
      title: string;
      id: string;
      videoId: string | null;
      artists: string;
      playlistIDs: string[];
      favorite: string[];
      link: string | null;
      contents: {
        id: string;
        type: string;
        content: string;
      }[];
    }[];
  } | null>;
  "Recently Added": () => Promise<{
    playlistId?: string;
    canAddTo?: boolean;
    data: {
      title: string;
      id: string;
      videoId: string | null;
      artists: string;
      playlistIDs: string[];
      favorite: string[];
      link: string | null;
      contents: {
        id: string;
        type: string;
        content: string;
      }[];
    }[];
  } | null>;
  "Recently Played": () => Promise<{
    playlistId?: string;
    canAddTo?: boolean;
    data: {
      title: string;
      id: string;
      videoId: string | null;
      artists: string;
      playlistIDs: string[];
      favorite: string[];
      link: string | null;
      contents: {
        id: string;
        type: string;
        content: string;
      }[];
    }[];
  } | null>;
  [key: string]:
    | (() => Promise<{
        playlistId?: string;
        canAddTo?: boolean;
        data: any[];
      } | null>)
    | undefined; // Added index signature
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
  "listTracks",
  "allPlaylistTracks",
  "editMusic",
];

export const genericPlaylistFunction: PlaylistFunction = {
  "Top Songs": () => getTopSongs(),
  "Recently Added": () => getRecentlyAdded(),
  "Recently Played": () => getRecentlyPlayed(),
};

export const sound = new Howl({
  // src: ["behrakha.mp3"],
  src: [
    "https://res.cloudinary.com/dy5p79uwl/video/upload/v1724853630/yyc/nw4dgwl7lexrphevhpis.mp3",
  ],
  html5: true,
});

export const DUE = 10;
