import { GuardianRelation } from "@prisma/client";
import { z } from "zod";

export const studentCreateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  schoolId: z.string().min(1, "School ID is required"),
  classroomId: z.string().optional(),
  guardianId: z.string().optional(),
  guardian: z
    .object({
      name: z.string().min(1, "Guardian name is required"),
      email: z.string().email("Invalid guardian email"),
      phone: z.string().optional(),
      relationship: z.nativeEnum(GuardianRelation, {
        required_error: "Relationship is required",
      }),
    })
    .optional(),
});
