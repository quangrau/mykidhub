import { prisma } from "@/lib/prisma";
import { Classroom } from "@prisma/client";

class ClassroomServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ClassroomServiceError";
  }
}

export interface ClassroomCreateData {
  name: string;
  schoolId: string;
  capacity: number;
}

export const classroomService = {
  findClassroomsBySchoolId: async (schoolId: string): Promise<Classroom[]> => {
    try {
      return prisma.classroom.findMany({
        where: {
          schoolId,
        },
        include: {
          _count: {
            select: {
              students: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch {
      throw new ClassroomServiceError("Failed to fetch classrooms");
    }
  },

  createClassroom: async (data: ClassroomCreateData): Promise<Classroom> => {
    try {
      const existingClassroom = await prisma.classroom.findFirst({
        where: {
          name: data.name,
          schoolId: data.schoolId,
        },
      });

      if (existingClassroom) {
        throw new ClassroomServiceError(
          "Classroom with this name already exists in the school"
        );
      }

      const result = await prisma.classroom.create({
        data: {
          name: data.name,
          capacity: data.capacity,
          school: {
            connect: {
              id: data.schoolId,
            },
          },
        },
      });

      return result;
    } catch (error) {
      if (error instanceof ClassroomServiceError) throw error;
      throw new ClassroomServiceError("Failed to create classroom");
    }
  },
};
