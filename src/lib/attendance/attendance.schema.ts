import * as z from "zod";

export const absenceCreateSchema = z.object({
  date: z.date(),
  endDate: z.date().optional(),
  notes: z.string().optional(),
  createWeekends: z.boolean().optional(),
});

export const absenceUpdateSchema = absenceCreateSchema.extend({
  id: z.string(),
});

export type AbsenceCreateData = z.infer<typeof absenceCreateSchema>;
export type AbsenceUpdateData = z.infer<typeof absenceUpdateSchema>;
