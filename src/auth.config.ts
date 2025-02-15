import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { signInSchema } from "@/lib/auth/auth.schema";
import { AuthService } from "@/lib/auth/auth.service";

export default {
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const validatedData = await signInSchema.safeParse(credentials);
        if (!validatedData.success) {
          return null;
        }

        const { email, password } = validatedData.data;
        const user = await AuthService.getUserByEmail(email);
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
