import { db } from "@/lib/database/prisma.service";
import { userWithSchoolQuery } from "./auth.types";

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

  async getUserWithSchool(userId: string) {
    try {
      return await db.user.findUnique({
        where: {
          id: userId,
        },
        ...userWithSchoolQuery,
      });
    } catch (error) {
      throw new AuthServiceError(
        `Failed to fetch user with school: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },
};
