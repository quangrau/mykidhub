import { prisma } from "@/lib/prisma";
import userService, { UserWithSchool } from "@/services/user";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export type SchoolSession = {
  id: string;
  name: string;
};

export async function getSchoolSession(): Promise<SchoolSession | undefined> {
  const session = await getServerSession(authOptions);
  return session?.user?.school;
}

export async function getUserSession() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
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
          const user = await userService.validateUserCredentials(
            credentials.email,
            credentials.password
          );

          return user;
        } catch (error) {
          console.log(error);
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
      if (user) {
        return {
          ...token,
          id: userWithSchool.id,
          school: userWithSchool.school,
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
          school: token.school,
        },
      };
    },
  },
};
