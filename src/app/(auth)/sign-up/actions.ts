"use server";

import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/database/prisma";
import { generateSlug, hashPassword } from "@/lib/utils";
import { SignUpSchema } from "@/schemas";
import schoolService from "@/services/school";
import { z } from "zod";

export async function signupAction(formData: z.infer<typeof SignUpSchema>) {
  // 1. Validate the form data
  const validatedData = SignUpSchema.safeParse(formData);
  if (!validatedData.success) {
    return {
      success: false,
      message: "Invalid form data.",
    };
  }

  // 2. Create school and user
  const { userName, userEmail, userPassword, schoolName } = validatedData.data;
  // const slug = generateSlug(validatedData.schoolName);
  const hashedPassword = await hashPassword(userPassword);

  try {
    // Check if user is exist by email
    const existingUser = await getUserByEmail(userEmail);
    if (existingUser) {
      return {
        success: false,
        message: "Email already exists.",
      };
    }

    // Check if school is exist by name or email
    const schoolSlug = generateSlug(schoolName);
    const existingSchool = await db.school.findFirst({
      where: { slug: schoolSlug },
    });
    if (existingSchool) {
      return {
        success: false,
        message: "School with this name already exists.",
      };
    }

    // TODO: Check if admin's email already exist.

    // Create school
    await schoolService.registerSchoolWithAdmin({
      user: {
        name: userName,
        email: userEmail,
        password: hashedPassword,
      },
      school: {
        name: schoolName,
        slug: schoolSlug,
      },
    });

    return { success: true, message: "Your school has been created." };
  } catch (error) {
    return { success: false, message: "Something went wrong." };
    throw error;
  }
}
