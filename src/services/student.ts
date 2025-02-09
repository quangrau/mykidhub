import { db } from "@/lib/db";
import { Prisma, Student } from "@prisma/client";

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
  async getStudentsBySchoolId(
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
  },

  async createStudent(data: Prisma.StudentCreateInput): Promise<Student> {
    try {
      const result = await db.student.create({ data });

      return result;
    } catch (error) {
      if (error instanceof StudentServiceError) throw error;
      console.error("Error creating student:", error);
      throw new StudentServiceError("Failed to create student");
    }
  },
};
