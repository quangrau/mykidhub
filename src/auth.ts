import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";
import { getUserById } from "./data/user";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) {
        return token;
      }

      const existingUser = await getUserById(token.sub);
      if (!existingUser) {
        return token;
      }
      console.log({ existingUser });

      token.role = existingUser.role;

      return token;
    },
  },
  ...authConfig,
});
