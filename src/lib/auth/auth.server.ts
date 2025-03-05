import { betterAuth, BetterAuthOptions, Session } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { customSession, organization } from "better-auth/plugins";

interface CustomSession extends Session {
  activeOrganizationId: string | null;
  role: "admin" | "teacher" | "guardian" | "owner";
}

import { AuthService } from "@/lib/auth/auth.service";
import { db } from "@/lib/database/prisma.service";
import { sendTeacherInvitation } from "@/lib/email";
import { ac, admin, guardian, owner, teacher } from "./permission";

const options = {
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
  ],
} satisfies BetterAuthOptions;

export const auth = betterAuth({
  ...options,
  plugins: [
    ...options.plugins,
    customSession(async ({ user, session }) => {
      // disable-next-line
      const { userId, activeOrganizationId } = session as CustomSession;

      if (!activeOrganizationId) {
        // TODO: Redirect to onboarding
        console.error("No organization found");
      }

      // Get member to check role
      const member = await db.member.findFirst({
        where: {
          userId: userId,
          organizationId: activeOrganizationId!,
        },
      });

      return {
        user,
        session: {
          ...session,
          role: member?.role,
        },
      };
    }),
    nextCookies(),
  ],
});
