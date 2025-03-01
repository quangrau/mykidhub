import { Prisma } from "@prisma/client";
import { z } from "zod";
import { studentCreateSchema } from "./student.schema";

export const studentWithClassroomQuery = {
  include: {
    classroom: {
      select: {
        id: true,
        name: true,
      },
    },
  },
};

export type StudentWithClassroom = Prisma.StudentGetPayload<
  typeof studentWithClassroomQuery
>;

export type StudentOption = Prisma.StudentGetPayload<{
  select: {
    id: true;
    firstName: true;
    lastName: true;
  };
}>;

export type StudentCreateData = z.infer<typeof studentCreateSchema>;
