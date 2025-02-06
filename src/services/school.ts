import { prisma } from "@/lib/prisma";
import { School, SchoolRole, SchoolType } from "@prisma/client";

export interface CreateSchoolData {
  name: string;
  phone?: string;
  type: SchoolType;
  capacity?: number;
  userId: string;
}

export interface UpdateSchoolData {
  name?: string;
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
  async createSchool(data: CreateSchoolData): Promise<School> {
    try {
      // Create school
      const school = await prisma.school.create({
        data: {
          name: data.name,
          phone: data.phone,
          type: data.type,
        },
      });

      // Associate user with school as administrator
      await prisma.schoolUser.create({
        data: {
          userId: data.userId,
          schoolId: school.id,
          role: SchoolRole.ADMINISTRATOR,
        },
      });

      return school;
    } catch (error) {
      if (error instanceof SchoolServiceError) throw error;
      console.error("Error creating school:", error);
      throw new SchoolServiceError("Failed to create school");
    }
  },

  async updateSchool(
    schoolId: string,
    data: UpdateSchoolData
  ): Promise<School> {
    try {
      const school = await prisma.school.findUnique({
        where: { id: schoolId },
      });

      if (!school) {
        throw new SchoolServiceError("School not found");
      }

      const updatedSchool = await prisma.school.update({
        where: { id: schoolId },
        data,
      });

      return updatedSchool;
    } catch (error) {
      if (error instanceof SchoolServiceError) throw error;
      console.error("Error updating school:", error);
      throw new SchoolServiceError("Failed to update school");
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

  async findSchoolsByUserId(userId: string): Promise<School[]> {
    try {
      const schoolUsers = await prisma.schoolUser.findMany({
        where: { userId },
        include: { school: true },
      });

      return schoolUsers.map((su) => su.school);
    } catch (error) {
      console.error("Error finding schools for user:", error);
      throw new SchoolServiceError("Failed to find schools for user");
    }
  },
};

export default schoolService;
