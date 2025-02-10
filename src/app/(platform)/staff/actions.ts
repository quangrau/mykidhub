"use server";

import { getUserSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { StaffFormData } from "./data/schema";

export async function addStaffAction(data: StaffFormData) {
  const user = await getUserSession();
  const schoolId = user?.schoolId;

  if (!schoolId) {
    return {
      success: false,
      message: "No school found.",
    };
  }

  try {
    // await classroomService.createStaff({});
    console.log(data);

    revalidatePath("/staffs");
    return {
      success: true,
      message: "Staff added successfully.",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
