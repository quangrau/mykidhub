import { prisma } from "@/lib/prisma";
import userService, { UserWithSchool } from "@/services/user";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

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
    async jwt({ token, user, session }) {
      const userWithSchool = user as UserWithSchool;
      console.log("jwt callback", { token, user, session });

      if (user) {
        return {
          ...token,
          id: userWithSchool.id,
          school: userWithSchool.school,
        };
      }
      return token;
    },
    async session({ session, token, user }) {
      console.log("session callback", { session, token, user });

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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
