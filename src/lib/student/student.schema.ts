import { z } from "zod";

export const studentCreateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  classroomId: z.string(),
  guardianId: z.string().optional(),
  guardian: z
    .object({
      name: z.string().min(1, "Guardian name is required"),
      email: z.string().email("Invalid guardian email"),
      phone: z.string().optional(),
      relationship: z.string().min(1, "Relationship is required"),
    })
    .optional(),
});
