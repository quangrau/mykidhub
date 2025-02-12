"use server";

import { getUserSession } from "@/lib/session";
import { studentService } from "@/services/student";
import { AccountRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { StudentFormData } from "./data/schema";

export async function addStudentAction(values: StudentFormData) {
  const user = await getUserSession();
  const schoolId = user?.schoolId;

  if (!schoolId) {
    return {
      error: "No school found.",
    };
  }

  try {
    await studentService.createStudent({
      firstName: values.firstName,
      lastName: values.lastName,
      school: {
        connect: {
          id: schoolId,
        },
      },
      classroom: {
        connect: {
          id: values.classroomId,
        },
      },
      guardians: {
        create: [
          {
            email: "alex.le@gmail.com",
            phone: values.guardian.phone,
            relationship: values.guardian.relationship,
            guardian: {
              connectOrCreate: {
                where: {
                  email: values.guardian.email,
                },
                create: {
                  name: values.guardian.name,
                  email: values.guardian.email,
                  phone: values.guardian.phone,
                  role: AccountRole.GUARDIAN,
                  schoolId,
                },
              },
            },
          },
        ],
      },
    });

    revalidatePath("/students");

    return {
      error: null,
    };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
