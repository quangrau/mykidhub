import { db } from "@/lib/db";
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

export interface ClassroomFilterOptions {
  status?: number;
  orderBy?: keyof Classroom;
  order?: "asc" | "desc";
}

export interface ClassroomOption {
  id: string;
  name: string;
}

export const classroomService = {
  getClassroomOptions: async (schoolId: string): Promise<ClassroomOption[]> => {
    try {
      return db.classroom.findMany({
        where: {
          schoolId,
          status: 1,
        },
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          name: "asc",
        },
      });
    } catch (error) {
      console.error(error);
      throw new ClassroomServiceError("Failed to fetch classroom options");
    }
  },

  getClassroomsBySchoolId: async (
    schoolId: string,
    options: ClassroomFilterOptions = {}
  ): Promise<Classroom[]> => {
    try {
      const { status = 1, orderBy = "createdAt", order = "desc" } = options;

      return db.classroom.findMany({
        where: {
          schoolId,
          status,
        },
        include: {
          _count: {
            select: {
              students: true,
            },
          },
        },
        orderBy: {
          [orderBy]: order,
        },
      });
    } catch (error) {
      console.error(error);
      throw new ClassroomServiceError("Failed to fetch classrooms");
    }
  },

  createClassroom: async (data: ClassroomCreateData): Promise<Classroom> => {
    try {
      const existingClassroom = await db.classroom.findFirst({
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

      const result = await db.classroom.create({
        data: {
          name: data.name,
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
