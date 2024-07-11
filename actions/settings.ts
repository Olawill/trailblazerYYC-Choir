"use server";

import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/client";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { SettingsSchema } from "@/schemas";
import { comparePassword, saltAndHashPassword } from "@/utils/helper";
import { z } from "zod";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(user.id as string);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use!" };
    }

    const verificationToken = await generateVerificationToken(values.email);

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Verification email sent!" };
  }

  let hashed: string = "";

  if (values.password && values.newPassword && dbUser.hashedPassword) {
    const passwordMatch = await comparePassword(
      values.password,
      dbUser.hashedPassword
    );

    if (!passwordMatch) {
      return { error: "Incorrect password!" };
    }

    hashed = await saltAndHashPassword(values.newPassword);

    values.password = undefined;
    values.newPassword = undefined;
  }

  // Prepare the update data
  const updateData: any = {
    ...values,
  };

  // Add hashed password to update data if 'hashed' is truthy
  if (hashed) {
    updateData.hashedPassword = hashed;
  }

  await prisma.user.update({
    where: { id: dbUser.id },
    data: updateData,
  });

  return { success: "Profile Updated!" };
};
