import { db } from "@/lib/database/prisma.service";
import { UserRole } from "@prisma/client";
import {
  StaffCreateData,
  StaffWithClassrooms,
  staffWithClassroomsQuery,
} from "./staff.types";

class StaffServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StaffServiceError";
  }
}

export const StaffService = {
  async create(data: StaffCreateData): Promise<StaffWithClassrooms> {
    try {
      const { name, email, phone, role, schoolId, classroomIds } = data;

      // Check if staff with email already exists in the school
      const existingStaff = await db.user.findFirst({
        where: {
          email,
          schoolId,
        },
      });

      if (existingStaff) {
        throw new StaffServiceError(
          "Staff with this email already exists in this school"
        );
      }

      // Check if role is not valid
      if (role && ![UserRole.SCHOOL_ADMIN, UserRole.TEACHER].includes(role)) {
        throw new StaffServiceError("Invalid role");
      }

      // Create staff profile
      return await db.user.create({
        data: {
          email,
          name,
          phone,
          role,
          school: {
            connect: { id: schoolId },
          },
          ...(classroomIds && classroomIds.length > 0
            ? {
                assignedClassrooms: {
                  create: classroomIds.map((classroomId) => ({
                    classroom: {
                      connect: { id: classroomId },
                    },
                  })),
                },
              }
            : {}),
        },
        ...staffWithClassroomsQuery,
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

  async getBySchoolId(
    schoolId: string,
    options: { status?: number; orderBy?: string; order?: "asc" | "desc" } = {}
  ): Promise<StaffWithClassrooms[]> {
    try {
      const { orderBy = "createdAt", order = "desc" } = options;

      return await db.user.findMany({
        where: {
          schoolId,
        },
        include: {
          assignedClassrooms: {
            include: {
              classroom: true,
            },
          },
        },
        orderBy: {
          [orderBy]: order,
        },
      });
    } catch (error) {
      throw new StaffServiceError(
        `Failed to fetch staff: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },
};
