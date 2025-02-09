import { db } from "@/lib/db";
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

export interface StudentCreateData {
  student: {
    name: string;
    dateOfBirth?: Date;
  };
  school: {
    id: string;
  };
  classroom: {
    id: string;
  };
  guardian: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    relationship?: string;
  };
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

  async createStudent(data: StudentCreateData): Promise<Student> {
    try {
      const existingStudent = await db.student.findFirst({
        where: {
          name: data.student.name,
          schoolId: data.school.id,
          classroomId: data.classroom.id,
        },
      });

      if (existingStudent) {
        throw new StudentServiceError(
          "Student with this name already exists in the classroom"
        );
      }

      // Handle guardian creation if guardian.id is not provided
      let guardianId = data.guardian.id;
      if (!guardianId && data.guardian.email) {
        // Check if a user with the provided email already exists
        const existingUser = await db.user.findUnique({
          where: { email: data.guardian.email },
        });

        if (existingUser) {
          throw new StudentServiceError(
            "A user with this email already exists"
          );
        }

        // Create new guardian user
        const newGuardian = await db.user.create({
          data: {
            name: data.guardian.name,
            email: data.guardian.email,
            schoolId: data.school.id,
          },
        });

        guardianId = newGuardian.id;
      }

      // Create student with guardian relationship if guardianId exists
      const result = await db.student.create({
        data: {
          name: data.student.name,
          dateOfBirth: data.student.dateOfBirth,
          school: {
            connect: {
              id: data.school.id,
            },
          },
          classroom: {
            connect: {
              id: data.classroom.id,
            },
          },
          ...(guardianId && {
            guardians: {
              create: {
                guardianId: guardianId,
                relation: data.guardian.relationship,
                email: data.guardian.email,
                phone: data.guardian.phone,
                status: "NOT_INVITED",
              },
            },
          }),
        },
      });

      return result;
    } catch (error) {
      if (error instanceof StudentServiceError) throw error;
      console.error("Error creating student:", error);
      throw new StudentServiceError("Failed to create student");
    }
  },
};
