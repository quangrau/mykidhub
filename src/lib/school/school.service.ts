import { db } from "@/lib/database/prisma.service";
import { School, User, UserRole } from "@prisma/client";

import { RegisterSchoolWithAdminInput } from "./school.types";

class SchoolServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SchoolServiceError";
  }
}

export class SchoolService {
  static async registerSchoolWithAdmin(
    input: RegisterSchoolWithAdminInput
  ): Promise<{ school: School; user: User }> {
    try {
      return await db.$transaction(async (tx) => {
        // Create the new school
        const school = await tx.school.create({
          data: {
            name: input.school.name,
            slug: input.school.slug,
            address: input.school.address,
          },
        });

        // Create the new user and associate with the school
        const user = await tx.user.create({
          data: {
            name: input.user.name,
            email: input.user.email,
            password: input.user.password, // Hash this before storing in production
            role: UserRole.SCHOOL_ADMIN, // First user is automatically a staff (admin by business logic)
            schoolId: school.id,
            emailVerified: false, // Default false, assuming email verification is needed
          },
        });

        return { school, user };
      });
    } catch (error) {
      console.error("Error registering school with admin:", error);
      throw new SchoolServiceError("Failed to register school with admin");
    }
  }

  static async findSchoolById(schoolId: string): Promise<School | null> {
    try {
      return await db.school.findUnique({
        where: { id: schoolId },
      });
    } catch (error) {
      console.error("Error finding school:", error);
      throw new SchoolServiceError("Failed to find school");
    }
  }
}
