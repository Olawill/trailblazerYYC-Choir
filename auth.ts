import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { getTwofactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getUserByEmail, getUserById } from "@/data/user";
import { prisma } from "@/lib/client";
import { LoginSchema } from "@/schemas";
import { comparePassword } from "@/utils/helper";
import { UserRole } from "@prisma/client";
import { getAccountByUserId } from "./data/account";

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
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
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow oauth without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id!);

      // Prevent sigin without email verification
      if (!existingUser?.emailVerified) return false;

      // TODO: 2FA Check
      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwofactorConfirmationByUserId(
          existingUser.id
        );

        if (!twoFactorConfirmation) return false;

        // Delete two factor confirmation for next sign in
        await prisma.twoFactorConfirmation.delete({
          where: {
            id: twoFactorConfirmation.id,
          },
        });
      }

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.image = token.picture;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.picture = existingUser.image;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    },
  },
});
