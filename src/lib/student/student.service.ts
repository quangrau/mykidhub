import { db } from "@/lib/database/prisma.service";
import { getSession } from "@/lib/utils/session";
import { GuardianService } from "../guardian/guardian.service";
import {
  studentWithClassroomQuery,
  type StudentCreateData,
} from "./student.types";

class StudentServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StudentServiceError";
  }
}

export class StudentService {
  static async getStudents() {
    try {
      const { session } = await getSession();
      const organizationId = session.activeOrganizationId!;

      const students = await db.student.findMany({
        where: {
          organizationId,
          active: 1,
        },
        ...studentWithClassroomQuery,
        orderBy: {
          createdAt: "desc",
        },
      });

      return students;
    } catch (error) {
      console.error("Error finding students:", error);
      throw new StudentServiceError("Failed to fetch students");
    }
  }

  static async createStudent(data: StudentCreateData) {
    try {
      const { session } = await getSession();
      const organizationId = session.activeOrganizationId!;
      const { name, birthDate, classroomId } = data;

      // Create the student
      const student = await db.student.create({
        data: {
          name,
          classroomId,
          organizationId,
          birthDate: birthDate != "" ? birthDate : undefined,
        },
      });

      // Create the guardian if provided
      const guardianData = data.guardian as {
        memberId?: string;
        name: string;
        email: string;
        phone: string;
        relationship: string;
      };
      if (!guardianData.memberId && guardianData.email) {
        await GuardianService.inviteGuardian({
          name: guardianData.name,
          email: guardianData.email,
          phone: guardianData.phone,
          relationship: guardianData.relationship,
          studentId: student.id,
          organizationId,
        });
      } else {
        await db.childrenGuardian.create({
          data: {
            studentId: student.id,
            memberId: guardianData.memberId!,
            relationship: guardianData.relationship,
          },
        });
      }

      // throw new StudentServiceError("Failed to create student");
    } catch (error) {
      if (error instanceof StudentServiceError) throw error;
      console.error("Error creating student:", error);
      throw new StudentServiceError("Failed to create student");
    }
  }

  static async getOptions() {
    try {
      const { session } = await getSession();
      const organizationId = session.activeOrganizationId!;

      const students = await db.student.findMany({
        where: { organizationId },
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          name: "asc",
        },
      });

      return students.map((student) => ({
        id: student.id,
        name: student.name,
      }));
    } catch (error) {
      console.error("Error finding student options:", error);
      throw new StudentServiceError("Failed to fetch student options");
    }
  }
}
