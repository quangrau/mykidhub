import { db } from "@/lib/database/prisma.service";
import { Invitation } from "@prisma/client";
import { generateId } from "better-auth";
import { headers } from "next/headers";
import { auth } from "../auth/auth.server";
import { getSession } from "../utils/session";
import { GuardianOption, GuardianWithStatus } from "./guardian.types";

class GuardianServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GuardianServiceError";
  }
}

export const GuardianService = {
  async getGuardianById(id: string) {
    try {
      return await db.user.findUnique({
        where: {
          id,
          // role: UserRole.GUARDIAN,
        },
        include: {
          // guardianOf: {
          //   include: {
          //     student: true,
          //   },
          // },
        },
      });
    } catch (error) {
      throw new GuardianServiceError(
        `Failed to fetch guardian: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  async getGuardianOptions(): Promise<GuardianOption[]> {
    try {
      const { session } = await getSession();
      const schoolId = session.activeOrganizationId!;

      const members = await db.member.findMany({
        where: {
          organizationId: schoolId,
          role: "guardian",
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      return members.map((guardian) => ({
        memberId: guardian.id,
        name: guardian.user.name,
        email: guardian.user.email,
      }));
    } catch (error) {
      throw new GuardianServiceError(
        `Failed to fetch guardian options: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  async getGuardiansWithStatus() {
    try {
      const { session } = await getSession();
      const organizationId = session.activeOrganizationId!;

      // Get pending invitations
      const invitations = await db.invitation.findMany({
        where: {
          organizationId,
          status: "pending",
          role: "guardian",
        },
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          studentId: true,
          studentRelation: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Get active members
      const members = await db.member.findMany({
        where: {
          organizationId,
          role: "guardian",
        },
        include: {
          user: {
            select: {
              name: true,
              phone: true,
              email: true,
              createdAt: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Combine results
      return [
        ...invitations.map((i) => ({
          id: i.id,
          name: i.name,
          phone: i.phone,
          email: i.email,
          status: "invited" as const,
          studentId: i.studentId,
          relationship: i.studentRelation,
          created_at: i.createdAt,
          type: "invitation",
        })),
        ...members.map((m) => ({
          id: m.id,
          name: m.user.name,
          phone: m.user.phone,
          email: m.user.email,
          status: "signed_up" as const,
          created_at: m.user.createdAt,
          type: "member",
        })),
      ] as unknown as GuardianWithStatus[];
    } catch (error) {
      throw new GuardianServiceError(
        `Failed to fetch guardians: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  async inviteGuardian(data: {
    email: string;
    name: string;
    phone: string;
    relationship: string;
    studentId: string;
    organizationId: string;
  }) {
    try {
      // Invite user to organization
      const email = data.email.toLowerCase().trim();
      const invitation = await auth.api.createInvitation({
        headers: await headers(),
        body: {
          email,
          role: "guardian",
          organizationId: data.organizationId,
        },
      });

      // Update invitation since better-auth does not allow extends schema
      await db.invitation.update({
        where: { id: invitation.id },
        data: {
          name: data.name,
          phone: data.phone,
          studentId: data.studentId,
          studentRelation: data.relationship,
        },
      });

      return invitation;
    } catch (error) {
      console.log({ error });
      if (error instanceof GuardianServiceError) throw error;
      throw new GuardianServiceError(
        `Failed to invite guardian: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  async reInviteGuardian(invitationId: string) {
    try {
      // Verify invitation exists
      const invitation = await db.invitation.findUnique({
        where: { id: invitationId },
      });

      if (!invitation) {
        throw new GuardianServiceError("Invitation not found");
      }

      // Delete the existing invitation
      await db.invitation.delete({
        where: { id: invitationId },
      });

      // Create a new invitation with the same details
      const newInvitation = await auth.api.createInvitation({
        headers: await headers(),
        body: {
          role: "guardian",
          email: invitation.email!,
          organizationId: invitation.organizationId,
        },
      });

      // Update new invitation with additional data
      await db.invitation.update({
        where: { id: newInvitation.id },
        data: {
          name: invitation.name,
          phone: invitation.phone,
          studentId: invitation.studentId,
          studentRelation: invitation.studentRelation,
        },
      });

      return newInvitation;
    } catch (error) {
      if (error instanceof GuardianServiceError) throw error;
      throw new GuardianServiceError(
        `Failed to re-invite guardian: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  async createGuardianAccount(data: {
    name: string;
    email: string;
    password: string;
    invitation: Invitation;
  }) {
    const { name, email, password, invitation } = data;

    // Step 1: Create account
    const signupData = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        organization: {
          connect: {
            id: invitation.organizationId,
          },
        },
      },
    });

    // Step 2: update invitation
    await db.invitation.update({
      where: { id: invitation.id },
      data: { status: "accepted" },
    });

    // Step 3: create member
    const member = await db.member.create({
      data: {
        id: generateId(),
        organizationId: invitation.organizationId,
        userId: signupData.user.id,
        role: "guardian",
        createdAt: new Date(),
      },
    });

    // Step 4: create children_guardian
    if (invitation.studentId && invitation.studentRelation) {
      await db.childrenGuardian.create({
        data: {
          memberId: member.id,
          studentId: invitation.studentId,
          relationship: invitation.studentRelation,
        },
      });
    }
  },

  async deleteGuardian(memberId: string) {
    try {
      // Remove member
      await db.member.delete({
        where: { id: memberId },
      });
    } catch (error) {
      if (error instanceof GuardianServiceError) throw error;
      throw new GuardianServiceError(
        `Failed to remove guardian: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },
};
