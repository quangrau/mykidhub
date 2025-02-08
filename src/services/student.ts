import { prisma } from "@/lib/prisma";
import { Student } from "@prisma/client";

export interface StudentWithClassroom extends Student {
  classroom: {
    id: string;
    name: string;
  };
}

class StudentServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StudentServiceError";
  }
}

export const studentService = {
  async findStudentsBySchoolId(
    schoolId: string
  ): Promise<StudentWithClassroom[]> {
    try {
      const students = await prisma.student.findMany({
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
  },
};
