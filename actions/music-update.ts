"use server";

import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/client";

export const deleteMember = async (id: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: "You are not authorized to perform this action" };
  }

  const hasPermission = user.role !== "USER";

  if (!hasPermission) {
    return { error: "Unauthorized" };
  }

  try {
    const member = await prisma.member.delete({
      where: {
        id,
      },
    });

    return { success: "Member deleted successfully!" };
  } catch (err) {
    // Handle errors appropriately
    console.log("error", err);
    return { error: "Something went wrong. Please try again!" };
  }
};

export const deleteMusicFromLibrary = async (musicId: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: "You are not authorized to perform this action" };
  }

  try {
    const existingMusic = await prisma.music.findFirst({
      where: {
        id: musicId,
      },
    });

    if (!existingMusic) {
      return { error: "Music not found!" };
    }

    // Check if userId exist in library and remove it
    if (existingMusic.libraryIDs.includes(user.id as string)) {
      await prisma.music.update({
        where: {
          id: existingMusic.id,
        },
        data: {
          libraryIDs: existingMusic.libraryIDs.filter((uid) => uid !== user.id),
        },
      });

      return { success: "Music library updated successfully!" };
    } else {
      return { error: "Music not found in your library!" };
    }
  } catch (err) {
    // Handle errors appropriately
    console.log("error", err);
    return { error: "Something went wrong. Please try again!" };
  }
};

export const deleteMusicFromPlaylist = async (
  musicId: string,
  playlistId: string
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "You are not authorized to perform this action" };
  }

  try {
    const existingPlaylist = await prisma.playlist.findFirst({
      where: {
        id: playlistId,
      },
    });

    if (!existingPlaylist) {
      return { error: "Playlist not found!" };
    }

    const existingMusic = await prisma.music.findFirst({
      where: {
        id: musicId,
      },
    });

    if (!existingMusic) {
      return { error: "Music not found!" };
    }

    await prisma.music.update({
      where: {
        id: existingMusic.id,
      },
      data: {
        playlistIDs: {
          set: existingMusic.playlistIDs.filter(
            (pId) => pId !== existingPlaylist.id
          ),
        },
      },
    });

    await prisma.playlist.update({
      where: {
        id: existingPlaylist.id,
      },
      data: {
        musicIDs: {
          set: existingPlaylist.musicIDs.filter((mId) => mId !== musicId),
        },
      },
    });

    return { success: "Playlist updated successfully!" };
  } catch (err) {
    // Handle errors appropriately
    console.log("error", err);
    return { error: "Something went wrong. Please try again!" };
  }
};

export const deleteMusic = async (musicId: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: "You are not authorized to perform this action" };
  }

  const hasPermission = user.role !== "USER";

  if (!hasPermission) {
    return { error: "Unauthorized" };
  }

  try {
    const existingMusic = await prisma.music.findFirst({
      where: {
        id: musicId,
      },
    });

    if (!existingMusic) {
      return { error: "Music not found!" };
    }

    // Update playlist
    const allPlayList = await prisma.playlist.findMany({
      where: {
        musicIDs: {
          has: existingMusic.id,
        },
      },
    });
    // Update each playlist to remove the specific music ID
    const updatePlaylist = allPlayList.map(
      async (playlist) =>
        await prisma.playlist.update({
          where: { id: playlist.id },
          data: {
            musicIDs: {
              // Remove the existingMusicId from the array
              set: playlist.musicIDs.filter((id) => id !== existingMusic.id),
            },
          },
        })
    );

    // Update playlist
    const allAuthors = await prisma.author.findMany({
      where: {
        musicIDs: {
          has: existingMusic.id,
        },
      },
    });
    // Update each playlist to remove the specific music ID
    const updateAuthors = allAuthors.map(
      async (author) =>
        await prisma.author.update({
          where: { id: author.id },
          data: {
            musicIDs: {
              // Remove the existingMusicId from the array
              set: author.musicIDs.filter((id) => id !== existingMusic.id),
            },
          },
        })
    );

    // Check if userId exist in library and remove it
    await prisma.music.delete({
      where: {
        id: existingMusic.id,
      },
    });

    return { success: "Music deleted successfully!" };
  } catch (err) {
    // Handle errors appropriately
    console.log("error", err);
    return { error: "Something went wrong. Please try again!" };
  }
};

export const changeMusicStatus = async (userId: string, musicId: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: "You are not authorized to perform this action" };
  }

  // const hasPermission = user.role !== "USER";

  // if (!hasPermission) {
  //   return { error: "Unauthorized" };
  // }

  try {
    const existingMusic = await prisma.music.findFirst({
      where: {
        id: musicId,
      },
    });

    if (!existingMusic) {
      return { error: "Music not found!" };
    }

    // Check if userId exist in favorite and remove it
    if (existingMusic.favorite.includes(userId)) {
      await prisma.music.update({
        where: {
          id: existingMusic.id,
        },
        data: {
          favorite: existingMusic.favorite.filter((uid) => uid !== userId),
        },
      });
    } else {
      await prisma.music.update({
        where: {
          id: existingMusic.id,
        },
        data: {
          favorite: {
            push: userId,
          },
        },
      });
    }

    return { success: "Music status updated successfully!" };
  } catch (err) {
    // Handle errors appropriately
    console.log("error", err);
    return { error: "Something went wrong. Please try again!" };
  }
};

export const addMusicToLibrary = async (userId: string, musicId: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: "You are not authorized to perform this action" };
  }

  try {
    const existingMusic = await prisma.music.findFirst({
      where: {
        id: musicId,
      },
    });

    if (!existingMusic) {
      return { error: "Music not found!" };
    }

    // Check if userId exist in library and remove it
    if (existingMusic.libraryIDs.includes(userId)) {
      await prisma.music.update({
        where: {
          id: existingMusic.id,
        },
        data: {
          libraryIDs: existingMusic.libraryIDs.filter((uid) => uid !== userId),
        },
      });
    } else {
      await prisma.music.update({
        where: {
          id: existingMusic.id,
        },
        data: {
          libraryIDs: {
            push: userId,
          },
        },
      });
    }

    return { success: "Music library updated successfully!" };
  } catch (err) {
    // Handle errors appropriately
    console.log("error", err);
    return { error: "Something went wrong. Please try again!" };
  }
};
