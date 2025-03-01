import { auth } from "@/lib/auth/auth.server";
import { db } from "@/lib/database/prisma.service";
import { getSession } from "@/lib/utils/session";
import { Invitation } from "@prisma/client";
import { generateId } from "better-auth";
import { headers } from "next/headers";
import {
  GetStaffsWithStatusOptions,
  StaffCreateUpdateData,
  StaffInviteData,
  StaffWithStatus,
} from "./staff.types";

class StaffServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StaffServiceError";
  }
}

export const StaffService = {
  async inviteStaff(data: StaffInviteData) {
    try {
      const { name, phone, schoolId } = data;
      const email = data.email.toLowerCase().trim();
      const role = data.role as "admin" | "teacher";

      // Invite user to organization
      const invitation = await auth.api.createInvitation({
        headers: await headers(),
        body: {
          role,
          email,
          organizationId: schoolId,
        },
      });

      // Update invitation since better-auth does not allow extends schema
      await db.invitation.update({
        where: { id: invitation.id },
        data: {
          name,
          phone,
        },
      });
    } catch (error) {
      if (error instanceof StaffServiceError) throw error;
      throw new StaffServiceError(
        `Failed to create staff: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  async updateStaff(data: StaffCreateUpdateData) {
    try {
      const { id, name, phone, role } = data;
      // get user by memberId
      const member = await db.member.findUnique({
        where: { id },
        include: {
          user: true,
        },
      });

      // Update user info and member role in a transaction
      await db.$transaction(async (tx) => {
        // Update user information
        await tx.user.update({
          where: { id: member?.userId },
          data: {
            name,
            phone,
          },
        });

        // Update member role if provided
        if (role !== member?.role) {
          await tx.member.updateMany({
            where: {
              id: member?.id,
            },
            data: {
              role: role as "admin" | "teacher",
            },
          });
        }
      });
    } catch (error) {
      if (error instanceof StaffServiceError) throw error;
      throw new StaffServiceError(
        `Failed to update staff: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  async removeStaff(memberId: string) {
    try {
      // get user by memberId
      const member = await db.member.findUnique({
        where: { id: memberId },
        include: {
          user: true,
        },
      });

      // Remove member
      await db.member.delete({
        where: { id: member?.id },
      });

      // Delete user
    } catch (error) {
      if (error instanceof StaffServiceError) throw error;
      throw new StaffServiceError(
        `Failed to remove staff: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  async createStaffAccount(data: {
    name: string;
    email: string;
    password: string;
    invitation: Invitation;
  }) {
    try {
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
      await db.member.create({
        data: {
          organizationId: invitation.organizationId,
          userId: signupData.user.id,
          role: invitation.role!,
          createdAt: new Date(),
          id: generateId(),
        },
      });
      return signupData;
    } catch (error) {
      throw new StaffServiceError(
        `Failed to create staff account: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  async getStaffsWithStatus(_: GetStaffsWithStatusOptions = {}) {
    try {
      // const { orderBy = "createdAt", order = "desc", active = 1 } = options;
      const { session } = await getSession();
      const organizationId = session.activeOrganizationId!;

      // Get pending invitations
      const invitations = await db.invitation.findMany({
        where: {
          organizationId,
          status: "pending",
          role: { in: ["owner", "admin", "teacher"] },
        },
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          role: true,
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
          role: { in: ["owner", "admin", "teacher"] },
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
          role: i.role,
          created_at: i.createdAt,
          type: "invitation",
        })),
        ...members.map((m) => ({
          id: m.id,
          name: m.user.name,
          phone: m.user.phone,
          email: m.user.email,
          status: "signed_up" as const,
          role: m.role,
          created_at: m.user.createdAt,
          type: "member",
        })),
      ] as unknown as StaffWithStatus[];
    } catch (error) {
      throw new StaffServiceError(
        `Failed to fetch staff: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  async GetStaffOptions() {
    try {
      const { session } = await getSession();
      const organizationId = session.activeOrganizationId!;
      const members = await db.member.findMany({
        where: {
          organizationId,
          role: { in: ["owner", "admin", "teacher"] },
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
      return members.map((m) => ({
        value: m.userId,
        label: m.user.name,
      }));
    } catch (error) {
      throw new StaffServiceError(
        `Failed to fetch staff: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },
};
