import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import { db } from "@/lib/database/prisma.service";
import { UserRole } from "@prisma/client";
import { AuthService } from "./lib/auth/auth.service";

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
        session.user.schoolId = token.schoolId as string | undefined;
        session.user.schoolName = token.schoolName as string | undefined;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) {
        return token;
      }

      const existingUser = await AuthService.getUserWithSchool(token.sub);
      if (!existingUser) {
        return token;
      }

      token.role = existingUser.role;
      token.schoolId = existingUser.schoolId;
      token.schoolName = existingUser.school?.name;

      return token;
    },
  },
  ...authConfig,
});
