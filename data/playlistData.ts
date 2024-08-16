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
        },
      });

      return currentListDetails;
    }
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
