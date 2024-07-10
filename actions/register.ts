"use server";

import { RegisterSchema } from "@/schemas";
import { z } from "zod";

import { getUserByEmail } from "@/data/user";
import { saltAndHashPassword } from "@/utils/helper";
import { prisma } from "@/lib/client";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid credentials!" };
  }

  const { name, email, password } = validatedFields.data;
  const hashedPassword = await saltAndHashPassword(password);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword,
    },
  });

  // Create verification token
  const verificationToken = await generateVerificationToken(email);

  // Send verification email
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "Confirmation email sent!" };
};
