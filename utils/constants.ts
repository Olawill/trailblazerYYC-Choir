import {
  getRecentlyAdded,
  getRecentlyPlayed,
  getTopSongs,
} from "@/data/playlistData";

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
];

export const genericPlaylistFunction: PlaylistFunction = {
  "Top Songs": () => getTopSongs(),
  "Recently Added": () => getRecentlyAdded(),
  "Recently Played": () => getRecentlyPlayed(),
};

export const DUE = 10;
