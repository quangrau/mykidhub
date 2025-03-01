import { db } from "@/lib/database/prisma.service";

class AuthServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthServiceError";
  }
}

export const AuthService = {
  async getUserById(id: string) {
    try {
      return await db.user.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new AuthServiceError(
        `Failed to fetch user: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  async getUserByEmail(email: string) {
    try {
      return await db.user.findUnique({
        where: {
          email,
        },
      });
    } catch (error) {
      throw new AuthServiceError(
        `Failed to fetch user: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  async getSchoolBySlug(slug: string) {
    try {
      return await db.organization.findUnique({
        where: {
          slug,
        },
      });
    } catch (error) {
      throw new AuthServiceError(
        `Failed to fetch school: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  async getActiveOrganization(userId: string) {
    try {
      return await db.member.findFirst({
        where: {
          userId,
        },
        select: {
          organizationId: true,
        },
      });
    } catch (error) {
      throw new AuthServiceError(
        `Failed to get active organization: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  async getInvitationById(id: string) {
    try {
      return await db.invitation.findUnique({
        where: {
          id,
        },
        include: {
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    } catch (error) {
      throw new AuthServiceError(
        `Failed to get invitation: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },
};
