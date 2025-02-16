import { z } from "zod";

import { GuardianRelation } from "@prisma/client";

const guardianSchema = z.object({
  name: z.string().min(1, "Guardian name is required"),
  email: z.string().email("Invalid guardian email"),
  phone: z.string().optional(),
  relationship: z.nativeEnum(GuardianRelation, {
    required_error: "Relationship is required",
  }),
});

export const studentCreateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  classroomId: z.string().optional(),
  guardian: z.union(
    [
      z.object({
        id: z.string().min(1, "Guardian is required"),
      }),
      guardianSchema,
    ],
    {
      required_error: "Guardian information is required",
      invalid_type_error: "Invalid guardian information provided",
    }
  ),
});
