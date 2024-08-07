"use server";

import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/client";
import { NewMusicSchema, NewPlaylistSchema } from "@/schemas";
import { z } from "zod";

export const newPlaylist = async (
  values: z.infer<typeof NewPlaylistSchema>
) => {
  const validatedFields = NewPlaylistSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid data!" };
  }

  const { name, canAddTo, musicIds } = validatedFields.data;

  const user = await currentUser();

  if (!user) {
    return { error: "You are not authorized to perform this action" };
  }

  const hasPermission = user.role !== "USER";

  if (!hasPermission) {
    return { error: "Unauthorized" };
  }

  const playlist = await prisma.playlist.findFirst({
    where: {
      name,
    },
  });

  if (playlist) {
    return { error: "Playlist name already in use!!" };
  }

  try {
    await prisma.playlist.create({
      data: {
        name,
        canAddTo: canAddTo === "yes",
        musicIDs: musicIds,
      },
    });

    return { success: "Playlist created!" };
  } catch (err) {
    // Handle errors appropriately
    console.log("error", err);
    return { error: "Something went wrong. Please try again!" };
  }
};

export const newMusic = async (values: z.infer<typeof NewMusicSchema>) => {
  const validatedFields = NewMusicSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid data!" };
  }

  const { title, link, playlistIds, authorIds, content } = validatedFields.data;

  const user = await currentUser();

  if (!user) {
    return { error: "You are not authorized to perform this action" };
  }

  const hasPermission = user.role !== "USER";

  if (!hasPermission) {
    return { error: "Unauthorized" };
  }

  const music = await prisma.music.findFirst({
    where: {
      link,
    },
  });

  if (music) {
    return { error: "Music already added!!" };
  }

  try {
    const videoId = link?.split("?")[0].split("/").slice(-1)[0];

    const createdMusic = await prisma.music.create({
      data: {
        title,
        link,
        videoId: videoId,
        authorIDs: authorIds,
        playlistIDs: playlistIds,
      },
    });

    // Add the content to contents table
    for (const c of content) {
      await prisma.content.create({
        data: {
          content: c.content,
          type: c.type,
          order: content.indexOf(c) + 1,
          musicId: createdMusic.id,
        },
      });
    }

    //Update the playlist and authors table
    for (const id of playlistIds) {
      await prisma.playlist.update({
        where: {
          id,
        },
        data: {
          musicIDs: {
            push: createdMusic.id,
          },
        },
      });
    }

    for (const id of authorIds) {
      await prisma.author.update({
        where: {
          id,
        },
        data: {
          musicIDs: {
            push: createdMusic.id,
          },
        },
      });
    }

    return { success: "Music created!" };
  } catch (err) {
    // Handle errors appropriately
    console.log("error", err);
    return { error: "Something went wrong. Please try again!" };
  }
};
