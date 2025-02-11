import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUserByEmail } from "./data/user";
import { SignInSchema } from "./schemas";

export default {
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const validatedData = await SignInSchema.safeParse(credentials);
        if (!validatedData.success) {
          return null;
        }

        const { email, password } = validatedData.data;
        const user = await getUserByEmail(email);
        if (!user || !user.password) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return null;
        }

        // return user object with their profile data
        return user;
      },
    }),
  ],
} satisfies NextAuthConfig;
