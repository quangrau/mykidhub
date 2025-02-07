import { prisma } from "@/lib/prisma";
import { Prisma, School, SchoolType, User } from "@prisma/client";

export type SchoolWithUser = School & {
  user: User;
};

export interface UpdateSchoolData {
  name?: string;
  slug?: string;
  phone?: string;
  type?: SchoolType;
  capacity?: number;
}

class SchoolServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SchoolServiceError";
  }
}

export const schoolService = {
  async createSchool(data: Prisma.SchoolCreateInput): Promise<School> {
    try {
      const existingSchool = await prisma.school.findFirst({
        where: { slug: data.slug },
      });

      if (existingSchool) {
        throw new SchoolServiceError("School with this slug already exists");
      }

      const result = await prisma.school.create({ data });

      return result;
    } catch (error) {
      if (error instanceof SchoolServiceError) throw error;
      console.error("Error creating school:", error);
      throw new SchoolServiceError("Failed to create school");
    }
  },

  async findSchoolById(schoolId: string): Promise<School | null> {
    try {
      const school = await prisma.school.findUnique({
        where: { id: schoolId },
      });

      return school;
    } catch (error) {
      console.error("Error finding school:", error);
      throw new SchoolServiceError("Failed to find school");
    }
  },
};

export default schoolService;
