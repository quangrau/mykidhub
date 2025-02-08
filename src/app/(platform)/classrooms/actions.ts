"use server";

import { getSchoolSession } from "@/lib/session";
import { classroomService } from "@/services/classroom";
import { revalidatePath } from "next/cache";
import { FormValues } from "./components/add-classroom-form";

export async function addClassroomAction(values: FormValues) {
  const school = await getSchoolSession();

  if (!school) {
    return {
      error: "No school found.",
    };
  }

  try {
    await classroomService.createClassroom({
      schoolId: school?.id,
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
