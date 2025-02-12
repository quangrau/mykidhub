import { z } from "zod";

export const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const SignUpSchema = z.object({
  userName: z.string().min(2, "Name must be at least 2 characters"),
  userEmail: z.string().email("Invalid email address"),
  userPassword: z.string().min(6, "Password must be at least 6 characters"),
  schoolName: z.string().min(2, "School name must be at least 2 characters"),
  schoolPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  schoolCapacity: z.number().min(1, "Capacity must be at least 1"),
});
