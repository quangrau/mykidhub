import { db } from "@/lib/database/prisma.service";
import { School, User, UserRole } from "@prisma/client";

interface RegisterSchoolWithAdminInput {
  school: {
    name: string;
    slug: string;
    address?: string;
  };
  user: {
    email: string;
    password: string;
    name?: string;
  };
}

class SchoolServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SchoolServiceError";
  }
}

export const schoolService = {
  async registerSchoolWithAdmin(
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
