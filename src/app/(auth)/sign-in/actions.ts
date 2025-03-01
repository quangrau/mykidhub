"use server";

import { z } from "zod";

import { signInSchema } from "@/lib/auth/auth.schema";
import { auth } from "@/lib/auth/auth.server";
import { APIError } from "better-auth/api";

export async function signInAction(values: z.infer<typeof signInSchema>) {
  const validatedData = await signInSchema.safeParse(values);
  if (!validatedData.success) {
    return {
      success: false,
      message: "Invalid credentials.",
    };
  }

  const { email, password } = validatedData.data;
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    return {
      success: true,
      message: "Successfully signed in.",
    };
  } catch (error) {
    if (error instanceof APIError) {
      return {
        success: false,
        message: error.body.message,
      };
    }

    return {
      success: false,
      message: "Something went wrong.",
    };
  }
}
