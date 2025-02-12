import { db } from "@/lib/database/prisma";
import { Prisma, UserRole } from "@prisma/client";

export class StaffServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StaffServiceError";
  }
}

type CreateStaffInput = {
  name: string;
  email: string;
  phone?: string;
  role: "SCHOOL_ADMIN" | "TEACHER";
  schoolId: string;
  classroomIds?: string[];
};

export const staffService = {
  async createStaff(input: CreateStaffInput) {
    try {
      const { name, email, phone, role, schoolId, classroomIds } = input;

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
      const staff = await db.user.create({
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
                classrooms: {
                  connect: classroomIds.map((id) => ({ id })),
                },
              }
            : {}),
        },
      });

      return staff;
    } catch (error) {
      console.error("Error creating staff:", error);
      throw new StaffServiceError("An unexpected error occurred");
    }
  },

  async getStaffBySchoolId(schoolId: string) {
    const withoutPassword = Prisma.validator<Prisma.UserOmit>()({
      password: true,
    });

    try {
      return await db.user.findMany({
        where: {
          schoolId,
        },
        omit: withoutPassword,
        include: {
          assignedClassrooms: {
            include: {
              classroom: true,
            },
          },
        },
      });
    } catch (error) {
      console.error("Error getting staff by school ID:", error);
      throw new StaffServiceError("An unexpected error occurred");
    }
  },
};
