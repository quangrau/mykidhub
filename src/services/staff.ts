import { db } from "@/lib/db";
import { AccountRole, Prisma } from "@prisma/client";

export class StaffServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StaffServiceError";
  }
}

type CreateStaffInput = {
  name: string;
  email: string;
  phone: string;
  role?: AccountRole;
  schoolId: string;
  classroomIds?: string[];
};

export const staffService = {
  async createStaff(input: CreateStaffInput) {
    try {
      const {
        name,
        email,
        phone,
        role = AccountRole.TEACHER,
        schoolId,
        classroomIds,
      } = input;

      // Check if staff with email already exists in the school
      const existingStaff = await db.staffSchool.findFirst({
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

      // Create staff profile
      const staff = await db.staffSchool.create({
        data: {
          name,
          email,
          phone,
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
        include: {
          classrooms: true,
          school: true,
        },
      });

      return staff;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new StaffServiceError(
          "Database error occurred while creating staff"
        );
      }
      if (error instanceof StaffServiceError) {
        throw error;
      }
      throw new StaffServiceError("An unexpected error occurred");
    }
  },
};
