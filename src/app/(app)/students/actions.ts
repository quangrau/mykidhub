"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { studentCreateSchema } from "@/lib/student/student.schema";
import { StudentService } from "@/lib/student/student.service";

export async function addStudentAction(
  values: z.infer<typeof studentCreateSchema>
) {
  const validatedData = await studentCreateSchema.safeParse(values);
  if (!validatedData.success) {
    return {
      success: false,
      message: "Invalid params.",
    };
  }

  try {
    await StudentService.createStudent(validatedData.data);

    revalidatePath("/students");
    return {
      success: true,
      message: "Student created.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function diableStudentAction(
  id: string,
  action: "graduate" | "drop"
) {
  try {
    await StudentService.disableStudent(id, action);
    revalidatePath("/students");
    return {
      success: true,
      message: "Student deleted.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
