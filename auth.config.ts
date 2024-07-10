import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { comparePassword } from "@/utils/helper";

export default {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        try {
          const validatedFields = LoginSchema.safeParse(credentials);
          if (!validatedFields.success) {
            throw new Error("Invalid credentials format");
          }

          const { email, password } = validatedFields.data;
          const user = await getUserByEmail(email);

          if (!user || !user.hashedPassword) {
            throw new Error("User not found or password not set");
          }

          const passwordsMatch = await comparePassword(
            password,
            user.hashedPassword
          );

          if (!passwordsMatch) {
            throw new Error("Incorrect password");
          }

          // Authentication successful
          return user;
        } catch (error: any) {
          // Handle errors or log them
          console.error("Authentication error:", error.message);
          return null;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
