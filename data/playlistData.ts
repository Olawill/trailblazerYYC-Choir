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
