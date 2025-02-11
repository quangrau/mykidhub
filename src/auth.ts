import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import { db } from "@/lib/db";
import { StaffRole } from "@prisma/client";
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
        session.user.role = token.role as StaffRole;
        session.user.schoolId = token.schoolId;
        session.user.schoolName = token.schoolName;
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

      if (existingUser.staff) {
        token.role = existingUser.staff.role;
        token.schoolId = existingUser.staff.school.id;
        token.schoolName = existingUser.staff.school.name;
      }

      return token;
    },
  },
  ...authConfig,
});
