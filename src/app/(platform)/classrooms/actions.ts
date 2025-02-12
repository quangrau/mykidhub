"use server";

import { getUserSession } from "@/lib/session";
import { classroomService } from "@/services/classroom";
import { revalidatePath } from "next/cache";
import { FormValues } from "./_components/add-classroom-form";

export async function addClassroomAction(values: FormValues) {
  const user = await getUserSession();
  const schoolId = user?.schoolId;

  if (!schoolId) {
    return {
      error: "No school found.",
    };
  }

  try {
    await classroomService.createClassroom({
      schoolId,
      ...values,
    });

    revalidatePath("/classrooms");

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
