import { db } from "@/lib/database/prisma.service";
import { Classroom } from "@prisma/client";
import type {
  ClassroomCreateData,
  ClassroomFilterOptions,
  ClassroomOption,
  ClassroomWithStudentCount,
} from "./classroom.types";

class ClassroomServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ClassroomServiceError";
  }
}

export const ClassroomService = {
  async getOptions(schoolId: string): Promise<ClassroomOption[]> {
    try {
      return await db.classroom.findMany({
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
      throw new ClassroomServiceError(
        `Failed to fetch classroom options: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  async getBySchoolId(
    schoolId: string,
    options: ClassroomFilterOptions = {}
  ): Promise<ClassroomWithStudentCount[]> {
    try {
      const { status = 1, orderBy = "createdAt", order = "desc" } = options;

      return await db.classroom.findMany({
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
      throw new ClassroomServiceError(
        `Failed to fetch classrooms: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  async create(data: ClassroomCreateData): Promise<Classroom> {
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

      return await db.classroom.create({
        data: {
          name: data.name,
          school: {
            connect: {
              id: data.schoolId,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof ClassroomServiceError) throw error;
      throw new ClassroomServiceError(
        `Failed to create classroom: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },
};
