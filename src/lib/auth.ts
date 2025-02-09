import { db } from "@/lib/db";
import accountService, { UserWithSchool } from "@/services/account";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export type SchoolSession = {
  id: string;
  name: string;
};

export async function getUserSession() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await accountService.validateUserCredentials(
            credentials.email,
            credentials.password
          );

          if (!user) {
            return null;
          }

          return user;
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      const userWithSchool = user as UserWithSchool;

      if (userWithSchool) {
        return {
          ...token,
          id: userWithSchool.id,
          role: userWithSchool.role,
          schoolId: userWithSchool?.school?.id,
          schoolName: userWithSchool?.school?.name,
        };
      }

      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
          schoolId: token.schoolId,
          schooldName: token.schoolName,
        },
      };
    },
  },
};
