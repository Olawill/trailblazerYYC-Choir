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

export const deleteUser = async (id: string) => {
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

export const changeUserRole = async (
  id: string,
  val: "USER" | "SUPERUSER" | "ADMIN"
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "You are not authorized to perform this action" };
  }

  const hasPermission = user.role === "ADMIN";

  if (!hasPermission) {
    return { error: "Unauthorized" };
  }

  try {
    const userToChangeRole = await prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!userToChangeRole) {
      return { error: "User not found!" };
    }

    await prisma.user.update({
      where: { id: userToChangeRole.id },
      data: {
        role: val,
      },
    });

    return { success: "User role updated successfully!" };
  } catch (err) {
    // Handle errors appropriately
    console.log("error", err);
    return { error: "Something went wrong. Please try again!" };
  }
};
