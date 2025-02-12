import { db } from "@/lib/database/prisma.service";
import { UserRole } from "@prisma/client";
import type { StudentCreateData, StudentWithClassroom } from "./student.types";

class StudentServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StudentServiceError";
  }
}

export class StudentService {
  static async getBySchoolId(
    schoolId: string
  ): Promise<StudentWithClassroom[]> {
    try {
      const students = await db.student.findMany({
        where: { schoolId },
        include: {
          classroom: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return students;
    } catch (error) {
      console.error("Error finding students:", error);
      throw new StudentServiceError("Failed to fetch students");
    }
  }

  static async create(data: StudentCreateData) {
    try {
      const {
        firstName,
        lastName,
        schoolId,
        classroomId,
        guardianId,
        guardian,
      } = data;

      return await db.$transaction(async (tx) => {
        // Create the student
        const student = await tx.student.create({
          data: {
            firstName,
            lastName,
            schoolId,
            classroomId,
          },
        });

        // Handle guardian assignment
        if (!guardianId && guardian) {
          // Create a new guardian
          const newGuardian = await tx.user.create({
            data: {
              email: guardian.email,
              name: guardian.name,
              phone: guardian.phone,
              role: UserRole.GUARDIAN,
            },
          });

          // Link the new guardian to the student
          await tx.studentGuardian.create({
            data: {
              studentId: student.id,
              guardianId: newGuardian.id,
              relationship: guardian.relationship,
            },
          });
        } else if (guardianId && guardian?.relationship) {
          // Link an existing guardian
          await tx.studentGuardian.create({
            data: {
              studentId: student.id,
              guardianId,
              relationship: guardian.relationship,
            },
          });
        }

        return student;
      });
    } catch (error) {
      if (error instanceof StudentServiceError) throw error;
      console.error("Error creating student:", error);
      throw new StudentServiceError("Failed to create student");
    }
  }

  static async getOptions(schoolId: string) {
    try {
      const students = await db.student.findMany({
        where: { schoolId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
        orderBy: {
          firstName: "asc",
        },
      });

      return students.map((student) => ({
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
      }));
    } catch (error) {
      console.error("Error finding student options:", error);
      throw new StudentServiceError("Failed to fetch student options");
    }
  }
}
