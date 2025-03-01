import { organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { ac, admin, guardian, owner, teacher } from "./permission";

export const authClient = createAuthClient({
  baseURL: process.env.BASE_URL!, // the base url of your auth server
  plugins: [
    organizationClient({
      ac: ac,
      roles: {
        owner,
        admin,
        teacher,
        guardian,
      },
    }),
  ],
});

export const { signIn, signOut, useSession } = authClient;
