import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins";

import { AuthService } from "@/lib/auth/auth.service";
import { db } from "@/lib/database/prisma.service";
import { sendTeacherInvitation } from "@/lib/email";
import { ac, admin, guardian, owner, teacher } from "./permission";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const organization = await AuthService.getActiveOrganization(
            session.userId
          );

          return {
            data: {
              ...session,
              activeOrganizationId: organization?.organizationId,
            },
          };
        },
      },
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5, // Cache duration in seconds
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: false,
  },
  plugins: [
    organization({
      ac: ac,
      roles: {
        owner,
        admin,
        teacher,
        guardian,
      },
      schema: {
        invitation: {},
      },
      async sendInvitationEmail(data) {
        const inviteLink = `${process.env.BASE_URL}/sign-up/${data.id}`;

        sendTeacherInvitation({
          email: data.email,
          invitedByUsername: data.inviter.user.name,
          invitedByEmail: data.inviter.user.email,
          schoolName: data.organization.name,
          inviteLink,
        });
      },
    }),
    nextCookies(),
  ],
});
