import { z } from "zod";

export const registerSchoolWithAdminSchema = z.object({
  school: z.object({
    name: z.string().min(1, "School name is required"),
    slug: z.string().min(1, "School slug is required"),
    address: z.string().optional(),
  }),
  user: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    name: z.string().optional(),
  }),
});
