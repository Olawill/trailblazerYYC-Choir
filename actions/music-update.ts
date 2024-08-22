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

export const deleteMusic = async (id: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: "You are not authorized to perform this action" };
  }

  const hasPermission = user.role === "ADMIN";

  if (!hasPermission) {
    return { error: "Unauthorized" };
  }

  try {
    const userToDelete = await prisma.user.delete({
      where: {
        id,
      },
    });

    return { success: "User deleted successfully!" };
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
