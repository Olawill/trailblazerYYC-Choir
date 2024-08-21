"use server";

import { prisma } from "@/lib/client";

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
    const playlists = await prisma.playlist.findMany();

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
      };
    });

    return modifiedList;
  } catch {
    return null;
  }
};
