"use server";

import { z } from "zod";

import { signIn } from "@/auth";
import { SignInSchema } from "@/schemas";
import { AuthError } from "next-auth";

export async function signInAction(values: z.infer<typeof SignInSchema>) {
  const validatedData = await SignInSchema.safeParse(values);
  if (!validatedData.success) {
    return {
      success: false,
      message: "Invalid credentials.",
    };
  }

  const { email, password } = validatedData.data;
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return {
      success: true,
      message: "Successfully signed in.",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            message: "Invalid credentials.",
          };
        default:
          return {
            success: false,
            message: "Something went wrong.",
          };
      }
    }

    throw error;
  }
}
