"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getUserSession } from "@/lib/session";
import { staffCreateSchema } from "@/lib/staff/staff.schema";
import { StaffService } from "@/lib/staff/staff.service";

export async function addStaffAction(
  values: z.infer<typeof staffCreateSchema>
) {
  const user = await getUserSession();
  const schoolId = user?.schoolId;

  if (!schoolId) {
    return {
      success: false,
      message: "No school found.",
    };
  }

  const validatedData = await staffCreateSchema.safeParse(values);
  if (!validatedData.success) {
    return {
      success: false,
      message: "Invalid params.",
    };
  }

  try {
    const { firstName, lastName, email, phone, role, classroomId } =
      validatedData.data;

    await StaffService.create({
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
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
