import { db } from "@/lib/database/prisma.service";
import { Organization } from "@prisma/client";

class SchoolServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SchoolServiceError";
  }
}

export class SchoolService {
  static async findSchoolById(schoolId: string): Promise<Organization | null> {
    try {
      return await db.organization.findUnique({
        where: { id: schoolId },
      });
    } catch (error) {
      console.error("Error finding school:", error);
      throw new SchoolServiceError("Failed to find school");
    }
  }
}
