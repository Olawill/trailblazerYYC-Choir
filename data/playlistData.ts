"use server";

import { prisma } from "@/lib/client";
import { equal } from "assert";
import { endOfDay, startOfDay, subDays } from "date-fns";

export const getAllMusic = async () => {
  try {
    const musics = await prisma.music.findMany({
      select: {
        id: true,
        title: true,
      },
    });

    return musics;
  } catch {
    return null;
  }
};

export const getPlaylists = async () => {
  try {
    const playlists = await prisma.playlist.findMany({
      select: {
        id: true,
        name: true,
        canAddTo: true,
      },
    });

    return playlists;
  } catch {
    return null;
  }
};

export const getAllPlay = async () => {
  try {
    const playlists = await prisma.playlist.findMany({
      orderBy: {
        canAddTo: "desc",
      },
    });

    return playlists;
  } catch {
    return null;
  }
};

export const getAuthors = async () => {
  try {
    const authors = await prisma.author.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return authors;
  } catch {
    return null;
  }
};

export const addAuthor = async (name: string) => {
  try {
    if (!name) return null;

    const existingAuthor = await prisma.author.findFirst({
      where: {
        name,
      },
    });

    if (existingAuthor) {
      return null;
    }

    const author = await prisma.author.create({
      data: {
        name,
      },
    });

    return author;
  } catch {
    return null;
  }
};

export const getCurrentList = async () => {
  try {
    const currentList = await prisma.playlist.findFirst({
      where: {
        current: true,
      },
      select: {
        id: true,
      },
    });

    if (currentList) {
      const currentListDetails = await prisma.music.findMany({
        where: {
          playlistIDs: {
            has: currentList.id,
          },
        },
        select: {
          id: true,
          title: true,
          videoId: true,
          authors: {
            select: {
              id: true,
              name: true,
            },
          },
          playlistIDs: true,
          favorite: true,
          libraryIDs: true,
        },
      });

      return currentListDetails;
    }
  } catch {
    return null;
  }
};

export const getAllMusicList = async () => {
  try {
    const currentListDetails = await prisma.music.findMany({
      select: {
        id: true,
        title: true,
        videoId: true,
        authors: {
          select: {
            id: true,
            name: true,
          },
        },
        playlistIDs: true,
        favorite: true,
        libraryIDs: true,
      },
    });

    return currentListDetails;
  } catch {
    return null;
  }
};

export const getMusicListForSearchTerm = async (term: string) => {
  try {
    const searchTermListDetails = await prisma.music.findMany({
      where: {
        OR: [
          {
            title: {
              contains: term,
              mode: "insensitive",
            },
          },
          {
            authors: {
              some: {
                name: {
                  contains: term,
                  mode: "insensitive",
                },
              },
            },
          },
          {
            contents: {
              some: {
                content: {
                  contains: term,
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        videoId: true,
        authors: {
          select: {
            id: true,
            name: true,
          },
        },
        playlistIDs: true,
        favorite: true,
        libraryIDs: true,
      },
    });

    return searchTermListDetails;
  } catch {
    return null;
  }
};

export const getAllPlaylistMusic = async () => {
  try {
    const currentList = await prisma.music.findMany({
      select: {
        id: true,
        title: true,
        videoId: true,
        authors: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            contents: true,
          },
        },
      },
    });

    const modifiedList = currentList.map((c) => {
      return {
        title: c.title,
        id: c.id,
        videoId: c.videoId,
        count: c._count.contents,
        artists: c.authors.map((a) => a.name).join(", "),
      };
    });

    return modifiedList;
  } catch {
    return null;
  }
};

// FOR THE MANAGE TABLE AND PAGE
export const getCurrentPlaylistMusic = async (id: string) => {
  try {
    const currentList = await prisma.music.findMany({
      where: {
        playlistIDs: {
          has: id,
        },
      },
      select: {
        id: true,
        title: true,
        videoId: true,
        authors: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            contents: true,
          },
        },
      },
    });

    const modifiedList = currentList.map((c) => {
      return {
        title: c.title,
        id: c.id,
        videoId: c.videoId,
        count: c._count.contents,
        artists: c.authors.map((a) => a.name).join(", "),
      };
    });

    return modifiedList;
  } catch {
    return null;
  }
};

export const deletePlaylist = async (id: string) => {
  try {
    const playlist = await prisma.playlist.findFirst({
      where: {
        id,
      },
    });

    if (playlist && playlist?.musicIDs.length > 0) {
      // Step 1: Fetch the current data
      const musicRecords = await prisma.music.findMany({
        where: {
          id: {
            in: playlist?.musicIDs,
          },
        },
        select: {
          id: true,
          playlistIDs: true,
        },
      });

      // Step 2: Modify the data in your application
      const updatedMusicRecords = musicRecords.map((record) => {
        return {
          id: record.id,
          playlistIDs: record.playlistIDs.filter((id) => id !== playlist.id),
        };
      });

      // Step 3: Update the records
      for (const record of updatedMusicRecords) {
        await prisma.music.update({
          where: { id: record.id },
          data: { playlistIDs: record.playlistIDs },
        });
      }
    }

    const deletedPlaylist = await prisma.playlist.delete({
      where: {
        id,
      },
    });
    return deletedPlaylist;
  } catch {
    return null;
  }
};

export const getFavPlaylistMusic = async (id: string) => {
  try {
    const favList = await prisma.music.findMany({
      where: {
        favorite: {
          has: id,
        },
      },
      select: {
        id: true,
        title: true,
        videoId: true,
        authors: {
          select: {
            name: true,
          },
        },
        playlistIDs: true,
        libraryIDs: true,
        favorite: true,
      },
    });

    const modifiedList = favList.map((c) => {
      return {
        title: c.title,
        id: c.id,
        videoId: c.videoId,
        artists: c.authors.map((a) => a.name).join(", "),
        playlistIDs: c.playlistIDs,
        favorite: c.favorite,
        libraryIDs: c.libraryIDs,
      };
    });

    return modifiedList;
  } catch {
    return null;
  }
};

export const getFavListForSearchTerm = async (term: string, id: string) => {
  try {
    const searchTermListDetails = await prisma.music.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                title: {
                  contains: term,
                  mode: "insensitive",
                },
              },
              {
                authors: {
                  some: {
                    name: {
                      contains: term,
                      mode: "insensitive",
                    },
                  },
                },
              },
              {
                contents: {
                  some: {
                    content: {
                      contains: term,
                      mode: "insensitive",
                    },
                  },
                },
              },
            ],
          },
          {
            favorite: {
              has: id,
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        videoId: true,
        authors: {
          select: {
            id: true,
            name: true,
          },
        },
        playlistIDs: true,
        favorite: true,
        libraryIDs: true,
      },
    });

    const modifiedList = searchTermListDetails.map((c) => {
      return {
        title: c.title,
        id: c.id,
        videoId: c.videoId,
        artists: c.authors.map((a) => a.name).join(", "),
        playlistIDs: c.playlistIDs,
        favorite: c.favorite,
        libraryIDs: c.libraryIDs,
      };
    });

    return modifiedList;
  } catch {
    return null;
  }
};

export const getLibraryMusic = async (id: string) => {
  try {
    const libraryList = await prisma.music.findMany({
      where: {
        libraryIDs: {
          has: id,
        },
      },
      select: {
        id: true,
        title: true,
        videoId: true,
        authors: {
          select: {
            name: true,
          },
        },
        playlistIDs: true,
        favorite: true,
      },
    });

    const modifiedList = libraryList.map((c) => {
      return {
        title: c.title,
        id: c.id,
        videoId: c.videoId,
        artists: c.authors.map((a) => a.name).join(", "),
        playlistIDs: c.playlistIDs,
        favorite: c.favorite,
      };
    });

    return modifiedList;
  } catch {
    return null;
  }
};

export const getPlaylistMusic = async (name: string) => {
  try {
    const list = await prisma.playlist.findFirst({
      where: {
        name,
      },
      select: {
        music: {
          select: {
            id: true,
            title: true,
            videoId: true,
            authors: {
              select: {
                name: true,
              },
            },
            playlistIDs: true,
            favorite: true,
          },
        },
      },
    });

    const modifiedList = list?.music.map((c) => {
      return {
        title: c.title,
        id: c.id,
        videoId: c.videoId,
        artists: c.authors.map((a) => a.name).join(", "),
        playlistIDs: c.playlistIDs,
        favorite: c.favorite,
      };
    });

    return modifiedList;
  } catch {
    return null;
  }
};

export const getTopSongs = async () => {
  try {
    const list = await prisma.music.findMany({
      where: {
        playlistIDs: {
          isEmpty: false,
        },
      },
      select: {
        id: true,
        title: true,
        videoId: true,
        authors: {
          select: {
            name: true,
          },
        },
        playlistIDs: true,
        favorite: true,
      },
    });

    const sortedList = list
      .map((music) => ({
        ...music,
        playlistCount: music.playlistIDs.length,
      }))
      .sort((a, b) => b.playlistCount - a.playlistCount);

    const modifiedList = sortedList?.map((c) => {
      return {
        title: c.title,
        id: c.id,
        videoId: c.videoId,
        artists: c.authors.map((a) => a.name).join(", "),
        playlistIDs: c.playlistIDs,
        favorite: c.favorite,
      };
    });

    return modifiedList;
  } catch {
    return null;
  }
};

export const getRecentlyAdded = async () => {
  try {
    const today = new Date();
    const startOfWeek = startOfDay(subDays(today, 7));
    const endOfWeek = endOfDay(today);

    const list = await prisma.music.findMany({
      where: {
        createdAt: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
      select: {
        id: true,
        title: true,
        videoId: true,
        authors: {
          select: {
            name: true,
          },
        },
        playlistIDs: true,
        favorite: true,
      },
    });

    const modifiedList = list?.map((c) => {
      return {
        title: c.title,
        id: c.id,
        videoId: c.videoId,
        artists: c.authors.map((a) => a.name).join(", "),
        playlistIDs: c.playlistIDs,
        favorite: c.favorite,
      };
    });

    return modifiedList;
  } catch {
    return null;
  }
};

export const getRecentlyPlayed = async () => {
  try {
    const today = new Date();
    const startOfWeek = startOfDay(subDays(today, 7));
    const endOfWeek = endOfDay(today);

    const list = await prisma.music.findMany({
      where: {
        lastTimePlayed: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
      select: {
        id: true,
        title: true,
        videoId: true,
        authors: {
          select: {
            name: true,
          },
        },
        playlistIDs: true,
        favorite: true,
      },
    });

    const modifiedList = list?.map((c) => {
      return {
        title: c.title,
        id: c.id,
        videoId: c.videoId,
        artists: c.authors.map((a) => a.name).join(", "),
        playlistIDs: c.playlistIDs,
        favorite: c.favorite,
      };
    });

    return modifiedList;
  } catch {
    return null;
  }
};
