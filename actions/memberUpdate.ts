"use server";

import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/client";

export const deleteMember = async () => {};

export const editMember = async () => {};

export const changeMemberStatus = async (id: string, val: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: "You are not authorized to perform this action" };
  }

  const hasPermission = user.role !== "USER";

  if (!hasPermission) {
    return { error: "Unauthorized" };
  }

  try {
    const member = await prisma.member.findFirst({
      where: {
        id,
      },
    });

    if (!member) {
      return { error: "Member not found!" };
    }

    await prisma.member.update({
      where: { id: member.id },
      data: {
        isActive: val === "active",
      },
    });

    return { success: "Member status updated successfully!" };
  } catch (err) {
    // Handle errors appropriately
    console.log("error", err);
    return { error: "Something went wrong. Please try again!" };
  }
};
