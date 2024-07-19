"use server";

import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/client";
import { NewMemberSchema } from "@/schemas";
import { Member } from "@prisma/client";
import { z } from "zod";

export const newMember = async (values: z.infer<typeof NewMemberSchema>) => {
  const validatedFields = NewMemberSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid data!" };
  }

  const { name, email, joined_since, amount_paid, status } =
    validatedFields.data;

  const user = await currentUser();

  if (!user) {
    return { error: "You are not authorized to perform this action" };
  }

  const hasPermission = user.role !== "USER";

  if (!hasPermission) {
    return { error: "Unauthorized" };
  }

  let newMember: Member;

  try {
    if (email) {
      // Check if a member with the same email exists
      const existingMember = await prisma.member.findUnique({
        where: {
          email,
        },
      });

      if (existingMember) {
        return {
          error: "Email already in use!",
        };
      }

      newMember = await prisma.member.create({
        data: {
          name,
          email,
          isActive: status === "active",
          dateJoined: new Date(joined_since),
        },
      });
    } else {
      newMember = await prisma.member.create({
        data: {
          name,
          email: `${name
            .split(" ")
            .pop()
            ?.toLowerCase()}@trailblazerchoristers.com`,
          isActive: status === "active",
          dateJoined: new Date(joined_since),
        },
      });
    }

    if (amount_paid > 0) {
      await prisma.payment.create({
        data: {
          memberId: newMember.id,
          amount: amount_paid,
        },
      });
    }

    return { success: "Member created!" };
  } catch (err) {
    // Handle errors appropriately
    console.log("error", err);
    return { error: "Something went wrong. Please try again!" };
  }
};

export const editMemberDetails = async (
  values: z.infer<typeof NewMemberSchema>,
  id: string
) => {
  const validatedFields = NewMemberSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid data!" };
  }

  const { name, email, joined_since, amount_paid, status } =
    validatedFields.data;

  const user = await currentUser();

  if (!user) {
    return { error: "You are not authorized to perform this action" };
  }

  const hasPermission = user.role !== "USER";

  if (!hasPermission) {
    return { error: "Unauthorized" };
  }

  const existingMember = await prisma.member.findFirst({
    where: {
      id,
    },
  });

  if (!existingMember) {
    return { error: "No member found!" };
  }

  try {
    await prisma.member.update({
      where: { id: existingMember.id },
      data: {
        name,
        email,
        isActive: status === "active",
        dateJoined: new Date(joined_since),
      },
    });

    if (amount_paid > 0) {
      await prisma.payment.create({
        data: {
          memberId: existingMember.id,
          amount: amount_paid,
        },
      });
    }

    return { success: "Member details updated!" };
  } catch (err) {
    console.log("error", err);
    return { error: "Something went wrong. Please try again!" };
  }
};
