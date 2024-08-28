export interface Album {
  id?: string;
  name: string;
  artist: string;
  cover: string;
  videoId?: string | null;
  playlistIDs?: string[];
  libraryIDs?: string[];
  isLiked?: boolean;
  link?: string | null;
  contents?: {
    id: string;
    type: string;
    content: string;
  }[];
}

export interface PlaylistQueryData {
  isLoading: boolean;
  data: Album[] | null;
  name: string;
}

export type AlbumQuery = Omit<Album, "name" | "artist" | "isLiked"> & {
  artists: string;
  title: string;
  favorite: string[];
};

export interface PlaylistData {
  playlistId?: string | null;
  data: AlbumQuery[] | null;
  canAddTo?: boolean | null;
}

// export const listenNowAlbums: Album[] = [
//   {
//     name: "React Rendezvous",
//     artist: "Ethan Byte",
//     cover:
//       "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=300&dpr=2&q=80",
//   },
//   {
//     name: "Async Awakenings",
//     artist: "Nina Netcode",
//     cover:
//       "https://images.unsplash.com/photo-1468817814611-b7edf94b5d60?w=300&dpr=2&q=80",
//   },
//   {
//     name: "The Art of Reusability",
//     artist: "Lena Logic",
//     cover:
//       "https://images.unsplash.com/photo-1528143358888-6d3c7f67bd5d?w=300&dpr=2&q=80",
//   },
//   {
//     name: "Stateful Symphony",
//     artist: "Beth Binary",
//     cover:
//       "https://images.unsplash.com/photo-1490300472339-79e4adc6be4a?w=300&dpr=2&q=80",
//   },
// ];

// export const madeForYouAlbums: Album[] = [
//   {
//     name: "Thinking Components",
//     artist: "Lena Logic",
//     cover:
//       "https://images.unsplash.com/photo-1615247001958-f4bc92fa6a4a?w=300&dpr=2&q=80",
//   },
//   {
//     name: "Functional Fury",
//     artist: "Beth Binary",
//     cover:
//       "https://images.unsplash.com/photo-1513745405825-efaf9a49315f?w=300&dpr=2&q=80",
//   },
//   {
//     name: "React Rendezvous",
//     artist: "Ethan Byte",
//     cover:
//       "https://images.unsplash.com/photo-1614113489855-66422ad300a4?w=300&dpr=2&q=80",
//   },
//   {
//     name: "Stateful Symphony",
//     artist: "Beth Binary",
//     cover:
//       "https://images.unsplash.com/photo-1446185250204-f94591f7d702?w=300&dpr=2&q=80",
//   },
//   {
//     name: "Async Awakenings",
//     artist: "Nina Netcode",
//     cover:
//       "https://images.unsplash.com/photo-1468817814611-b7edf94b5d60?w=300&dpr=2&q=80",
//   },
//   {
//     name: "The Art of Reusability",
//     artist: "Lena Logic",
//     cover:
//       "https://images.unsplash.com/photo-1490300472339-79e4adc6be4a?w=300&dpr=2&q=80",
//   },
// ];
