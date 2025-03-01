"use server";

import { db } from "@/lib/database/prisma.service";
import { GuardianService } from "@/lib/guardian/guardian.service";
import { revalidatePath } from "next/cache";

export async function deleteGuardianInvitationAction(id: string) {
  try {
    await db.invitation.delete({
      where: {
        id,
      },
    });

    revalidatePath("/guardians");
    return {
      success: true,
      message: "Guardian invitation deleted",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function deleteGuardianAction(memberId: string) {
  try {
    await GuardianService.deleteGuardian(memberId);

    revalidatePath("/guardians");
    return {
      success: true,
      message: "Guardian deleted",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
