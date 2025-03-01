import { z } from "zod";

const guardianSchema = z.object({
  name: z.string().min(1, "Guardian name is required"),
  email: z.string().email("Invalid guardian email"),
  phone: z.string().optional(),
  relationship: z.string().min(1, "Relationship is required"),
});

export const studentCreateSchema = z.object({
  name: z.string().min(1, "Last name is required"),
  birthDate: z.string().optional(),
  classroomId: z.string().optional(),
  guardian: z.union(
    [
      z.object({
        memberId: z.string().min(1, "Guardian is required"),
        relationship: z.string().min(1, "Relationship is required"),
      }),
      guardianSchema,
    ],
    {
      required_error: "Guardian information is required",
      invalid_type_error: "Invalid guardian information provided",
    }
  ),
});
