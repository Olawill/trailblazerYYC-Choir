import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/client";
import { NewMemberSchema } from "@/schemas";
import { User, UserRole } from "@prisma/client";
import { z } from "zod";

type newMemberUser = User & {
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
};

export const newMember = async (
  values: z.infer<typeof NewMemberSchema>,
  user: newMemberUser
) => {
  if (!user) {
    return { error: "Unauthorized" };
  }

  const hasPermission = user.role === "USER";

  if (!hasPermission) {
    return { error: "Unauthorized" };
  }

  if (values.email) {
    const exisitingMemberEmail = await prisma.member.findUnique({
      where: {
        email: values.email,
      },
    });

    if (exisitingMemberEmail) {
      return { error: "Email already in use." };
    }
  }

  try {
    // Assuming this is within an asynchronous function

    // Initialize memberData with basic properties
    let memberData = {
      name: values.name,
      email: values.email,
      isActive: values.status === "Active",
      dateJoined: new Date(values.joined_since),
      amountPaid: values.amount_paid,
      userId: "",
    };

    // Check if the user already exists in the database
    const existingUser = await prisma.user.findUnique({
      where: {
        email: values.email,
      },
    });

    // Conditionally add userId to memberData if existingUser is found
    if (existingUser) {
      memberData.userId = existingUser.id;
    }

    // Create the member using Prisma's create method
    await prisma.member.create({
      data: memberData,
    });

    return { success: "Profile Updated!" };
  } catch {
    // Handle errors appropriately
    return { error: "Something went wrong. Please try again!" };
  }
};
