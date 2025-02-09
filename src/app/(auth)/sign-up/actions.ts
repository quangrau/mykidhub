"use server";

import { generateSlug, hashPassword } from "@/lib/utils";
import schoolService from "@/services/school";
import { AccountRole } from "@prisma/client";
import { z } from "zod";

const signupSchema = z.object({
  userName: z.string().min(2, "Name must be at least 2 characters"),
  userEmail: z.string().email("Invalid email address"),
  userPassword: z.string().min(6, "Password must be at least 6 characters"),
  schoolName: z.string().min(2, "School name must be at least 2 characters"),
  schoolPhone: z.string().min(10, "Phone number must be at least 10 digits"),
});

export type SignupFormData = z.infer<typeof signupSchema>;

export async function signupAction(formData: SignupFormData) {
  try {
    // 1. Validate the form data
    const validationResult = signupSchema.safeParse(formData);
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.errors,
      };
    }

    // 2. Create school and user
    const validatedData = validationResult.data;
    const slug = generateSlug(validatedData.schoolName);
    const hashedPassword = await hashPassword(validatedData.userPassword);

    const data = await schoolService.createSchool({
      slug,
      name: validatedData.schoolName,
      phone: validatedData.schoolPhone,
      adminEmail: validatedData.userEmail,
      accounts: {
        create: {
          name: validatedData.userName,
          email: validatedData.userEmail,
          phone: validatedData.schoolPhone,
          password: hashedPassword,
          role: AccountRole.SCHOOL_ADMIN,
        },
      },
    });

    return { success: true, data };
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }

    return { success: false, error: "Something went wrong" };
  }
}
