import { z } from "zod";

export const guardianCreateSchema = z.object({
  name: z.string().min(1, "Guardian name is required"),
  email: z.string().email("Invalid guardian email"),
  phone: z.string().optional(),
  relationship: z.string().min(1, "Relationship is required"),
});
