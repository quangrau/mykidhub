"use server";

import { APIError } from "better-auth/api";
import { z } from "zod";

import { createAccountFormSchema, signUpSchema } from "@/lib/auth/auth.schema";
import { auth } from "@/lib/auth/auth.server";
import { AuthService } from "@/lib/auth/auth.service";
import { db } from "@/lib/database/prisma.service";
import { GuardianService } from "@/lib/guardian/guardian.service";
import { StaffService } from "@/lib/staff/staff.service";
import { generateSlug } from "@/lib/utils";

export async function signUpAction(formData: z.infer<typeof signUpSchema>) {
  // 1. Validate the form data
  const validatedData = signUpSchema.safeParse(formData);
  if (!validatedData.success) {
    return {
      success: false,
      message: "Invalid form data.",
    };
  }

  const { userName, userEmail, userPassword, schoolName } = validatedData.data;
  try {
    // Check if user is exist by email
    const existingUser = await AuthService.getUserByEmail(userEmail);
    if (existingUser) {
      return {
        success: false,
        message: "Email already exists.",
      };
    }

    // Check if school is exist
    const schoolSlug = generateSlug(schoolName);
    const existingSchool = await AuthService.getSchoolBySlug(schoolSlug);
    if (existingSchool) {
      return {
        success: false,
        message: "School with this name already exists.",
      };
    }

    // Create user
    const userData = await auth.api.signUpEmail({
      body: {
        name: userName,
        email: userEmail,
        password: userPassword,
      },
    });

    // Create school
    await auth.api.createOrganization({
      body: {
        name: schoolName,
        slug: schoolSlug,
        userId: userData.user.id,
      },
    });

    return { success: true, message: "Your school has been created." };
  } catch (error) {
    if (error instanceof APIError) {
      return { success: false, message: error.message };
    }

    return { success: false, message: "Something went wrong." };
  }
}

export async function createAccountAction(
  formData: z.infer<typeof createAccountFormSchema>
) {
  // 1. Validate the form data
  const validatedData = createAccountFormSchema.safeParse(formData);
  if (!validatedData.success) {
    return {
      success: false,
      message: "Invalid form data.",
    };
  }

  try {
    const { name, email, password, invitationId } = validatedData.data;

    // Step 1: Verify invitationId
    const invitation = await db.invitation.findFirst({
      where: {
        id: invitationId,
      },
    });
    if (!invitation) {
      return {
        success: false,
        message: "Invalid invitation.",
      };
    }

    switch (invitation.role) {
      case "admin":
      case "teacher":
        await StaffService.createStaffAccount({
          name,
          email,
          password,
          invitation,
        });
        break;

      case "guardian":
        await GuardianService.createGuardianAccount({
          name,
          email,
          password,
          invitation,
        });
        break;

      default:
        break;
    }

    // Step 5: Return success message
    return { success: true, message: "Your account has been created." };
  } catch (error) {
    console.log({ error });
    if (error instanceof APIError) {
      return { success: false, message: error.message };
    }

    return { success: false, message: "Something went wrong." };
  }
}
