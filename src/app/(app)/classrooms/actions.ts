"use server";

import { ClassroomService } from "@/lib/classroom/classroom.service";
import { getSession } from "@/lib/utils/session";
import { revalidatePath } from "next/cache";
import { FormValues } from "./_components/classrooms-add-form";

export async function addClassroomAction(values: FormValues) {
  const data = await getSession();
  const schoolId = data?.session.activeOrganizationId;

  if (!schoolId) {
    return {
      success: false,
      message: "No school found.",
    };
  }

  try {
    await ClassroomService.create({
      schoolId,
      ...values,
    });

    revalidatePath("/classrooms");

    return {
      success: true,
      message: "Classroom created.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function deleteClassroomAction(id: string) {
  try {
    await ClassroomService.delete(id);

    revalidatePath("/classrooms");
    return {
      success: true,
      message: "Classroom deleted.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
