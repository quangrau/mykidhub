"use server";

import schoolService from "@/services/school";
import userService from "@/services/user";
import { UserRole } from "@prisma/client";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  schoolName: z.string().min(2, "School name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  childCareType: z.string().min(1, "Please select a child care type"),
});

export type SignupFormData = z.infer<typeof signupSchema>;

export async function signup(formData: SignupFormData) {
  try {
    // Validate the form data
    const validatedData = signupSchema.parse(formData);

    // Create user with administrator role
    const user = await userService.createUser({
      name: validatedData.name,
      email: validatedData.email,
      password: validatedData.password,
      role: UserRole.ADMIN,
    });

    // Create school and associate with user
    await schoolService.createSchool({
      name: validatedData.schoolName,
      phone: validatedData.phone,
      type: "HOME",
      userId: user.id,
    });

    // Authenticate user and redirect to dashboard

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }

    return { success: false, error: "Something went wrong" };
  }
}
