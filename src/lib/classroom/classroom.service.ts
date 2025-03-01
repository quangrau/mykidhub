import { db } from "@/lib/database/prisma.service";
import { getSession } from "@/lib/utils/session";
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
  async getOptions(): Promise<ClassroomOption[]> {
    try {
      const { session } = await getSession();
      const organizationId = session.activeOrganizationId!;

      return await db.classroom.findMany({
        where: {
          organizationId,
          active: 1,
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
    options: ClassroomFilterOptions = {}
  ): Promise<ClassroomWithStudentCount[]> {
    try {
      const { session } = await getSession();
      const organizationId = session.activeOrganizationId!;
      const { active = 1, orderBy = "createdAt", order = "desc" } = options;

      return await db.classroom.findMany({
        where: {
          organizationId,
          active,
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
      const { session } = await getSession();
      const organizationId = session.activeOrganizationId!;

      const existingClassroom = await db.classroom.findFirst({
        where: {
          name: data.name,
          organizationId,
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
          organization: {
            connect: {
              id: organizationId,
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

  async delete(id: string): Promise<boolean> {
    try {
      await db.classroom.update({
        where: {
          id,
        },
        data: {
          active: 0,
        },
      });
      return true;
    } catch (error) {
      throw new ClassroomServiceError(
        `Failed to delete classroom: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },
};
