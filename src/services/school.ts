import { db } from "@/lib/db";
import { Prisma, School } from "@prisma/client";

class SchoolServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SchoolServiceError";
  }
}

export const schoolService = {
  async createSchool(data: Prisma.SchoolCreateInput): Promise<School> {
    try {
      const existingSchool = await db.school.findFirst({
        where: { name: data.name },
      });

      if (existingSchool) {
        throw new SchoolServiceError("School with this name already exists");
      }

      const result = await db.school.create({ data });

      return result;
    } catch (error) {
      if (error instanceof SchoolServiceError) throw error;
      console.error("Error creating school:", error);
      throw new SchoolServiceError("Failed to create school");
    }
  },

  async findSchoolById(schoolId: string): Promise<School | null> {
    try {
      const school = await db.school.findUnique({
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
