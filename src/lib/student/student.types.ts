import { Prisma } from "@prisma/client";
import { z } from "zod";
import { studentCreateSchema } from "./student.schema";

export type StudentWithClassroom = Prisma.StudentGetPayload<{
  include: {
    classroom: {
      select: {
        id: true;
        name: true;
      };
    };
  };
}>;

export type StudentOption = Prisma.StudentGetPayload<{
  select: {
    id: true;
    firstName: true;
    lastName: true;
  };
}>;

export type StudentCreateData = z.infer<typeof studentCreateSchema>;
