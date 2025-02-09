import { z } from "zod";

export const studentFormSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    classroomId: z.string().min(1, "Classroom is required"),
    guardian: z.object({
      id: z.string().optional(),
      name: z.string().optional(),
      email: z.string().email("Invalid email").optional(),
      phone: z.string().optional(),
      relationship: z.string().optional(),
    }),
  })
  .refine(
    (data) => {
      if (!data.guardian?.id) {
        return (
          data.guardian?.name &&
          data.guardian?.email &&
          data.guardian?.relationship
        );
      }
      return true;
    },
    {
      message: "Guardian information is required when creating a new guardian",
      path: ["guardian", "name"],
    }
  );

export type StudentFormData = z.infer<typeof studentFormSchema>;
