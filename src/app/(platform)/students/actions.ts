"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getUserSession } from "@/lib/session";
import { studentCreateSchema } from "@/lib/student/student.schema";
import { StudentService } from "@/lib/student/student.service";

export async function addStudentAction(
  values: z.infer<typeof studentCreateSchema>
) {
  const user = await getUserSession();
  const schoolId = user?.schoolId;

  if (!schoolId) {
    return {
      success: false,
      message: "No school found.",
    };
  }

  const validatedData = await studentCreateSchema.safeParse(values);
  if (!validatedData.success) {
    return {
      success: false,
      message: "Invalid params.",
    };
  }

  try {
    await StudentService.create(validatedData.data);

    revalidatePath("/students");
    return {
      success: true,
      message: "Staff members created.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
