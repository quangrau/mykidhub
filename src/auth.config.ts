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
          // throw new Error("Invalid credentials.");
        }

        const { email, password } = validatedData.data;
        const user = await getUserByEmail(email);
        if (!user || !user.password) {
          return null;
          // throw new Error("Invalid credentials.");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return null;
          // throw new Error("Invalid credentials.");
        }

        // return user object with their profile data
        return user;
      },
    }),
  ],
} satisfies NextAuthConfig;
