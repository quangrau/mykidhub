"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getUserSession } from "@/lib/auth";
import { createStaffSchema } from "@/schemas";
import { staffService } from "@/services/staff";

export async function addStaffAction(
  values: z.infer<typeof createStaffSchema>
) {
  const user = await getUserSession();
  const schoolId = user?.schoolId;

  if (!schoolId) {
    return {
      success: false,
      message: "No school found.",
    };
  }

  const validatedData = await createStaffSchema.safeParse(values);
  if (!validatedData.success) {
    return {
      success: false,
      message: "Invalid params.",
    };
  }

  try {
    const { firstName, lastName, email, phone, role, classroomId } =
      validatedData.data;

    await staffService.createStaff({
      email,
      phone,
      name: `${firstName} ${lastName}`,
      role: role as "SCHOOL_ADMIN" | "TEACHER",
      schoolId,
      classroomIds: classroomId ? [classroomId] : undefined,
    });

    revalidatePath("/staffs");

    return {
      success: true,
      message: "Staff members created.",
    };
  } catch (error) {
    console.error("Error adding staff:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
