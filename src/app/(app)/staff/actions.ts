"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/database/prisma.service";
import { staffCreateUpdateSchema } from "@/lib/staff/staff.schema";
import { StaffService } from "@/lib/staff/staff.service";
import { StaffCreateUpdateData } from "@/lib/staff/staff.types";
import { getSession } from "@/lib/utils/session";

export async function addStaffAction(values: StaffCreateUpdateData) {
  const data = await getSession();
  const schoolId = data?.session.activeOrganizationId;

  if (!schoolId) {
    return {
      success: false,
      message: "No school found.",
    };
  }

  const validatedData = await staffCreateUpdateSchema.safeParse(values);
  if (!validatedData.success) {
    return {
      success: false,
      message: "Invalid params.",
    };
  }

  try {
    const { name, email, phone, role, classroomId } = validatedData.data;
    const formattedEmail = email.toLowerCase().trim();

    await StaffService.inviteStaff({
      name,
      phone,
      email: formattedEmail,
      role: role as "admin" | "teacher",
      schoolId,
      classroomId,
    });

    revalidatePath("/staffs");

    return {
      success: true,
      message: "Staff members added",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function editStaffAction(values: StaffCreateUpdateData) {
  const validatedData = await staffCreateUpdateSchema.safeParse(values);
  if (!validatedData.success) {
    return {
      success: false,
      message: "Invalid params.",
    };
  }
  try {
    await StaffService.updateStaff(validatedData.data);

    revalidatePath("/staffs");
    return {
      success: true,
      message: "Staff member updated",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function deleteStaffAction(id: string) {
  try {
    await StaffService.removeStaff(id);
    revalidatePath("/staffs");
    return {
      success: true,
      message: "Staff member deleted",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function deleteStaffInvitationAction(id: string) {
  try {
    await db.invitation.delete({
      where: {
        id,
      },
    });

    revalidatePath("/staffs");
    return {
      success: true,
      message: "Staff member invitation deleted",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
