import { db } from "@/lib/database/prisma.service";
import { UserRole } from "@prisma/client";
import {
  GuardianFilterOptions,
  guardianOptionQuery,
  studentGuardianQuery,
  StudentGuardianWithRelations,
} from "./guardian.types";

class GuardianServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GuardianServiceError";
  }
}

export const GuardianService = {
  async getBySchoolId(
    schoolId: string,
    options: GuardianFilterOptions = {}
  ): Promise<StudentGuardianWithRelations[]> {
    try {
      const { orderBy = "createdAt", order = "desc", status } = options;

      return await db.studentGuardian.findMany({
        where: {
          schoolId,
          guardian: {
            role: UserRole.GUARDIAN,
            ...(status !== undefined ? { status } : {}),
          },
        },
        ...studentGuardianQuery,
        orderBy: {
          [orderBy]: order,
        },
      });
    } catch (error) {
      throw new GuardianServiceError(
        `Failed to fetch guardians: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  async getGuardianById(id: string) {
    try {
      return await db.user.findUnique({
        where: {
          id,
          role: UserRole.GUARDIAN,
        },
        include: {
          guardianOf: {
            include: {
              student: true,
            },
          },
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
  async getGuardianOptions(schoolId: string) {
    try {
      const guardians = await db.user.findMany({
        where: {
          schoolId,
          role: UserRole.GUARDIAN,
        },
        ...guardianOptionQuery,
      });

      return guardians;
    } catch (error) {
      throw new GuardianServiceError(
        `Failed to fetch guardian options: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },
};
