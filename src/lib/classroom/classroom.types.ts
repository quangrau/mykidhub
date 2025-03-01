import { Classroom, Prisma } from "@prisma/client";

export interface ClassroomCreateData {
  name: string;
  schoolId: string;
  capacity: number;
}

export interface ClassroomFilterOptions {
  active?: number;
  orderBy?: keyof Classroom;
  order?: "asc" | "desc";
}

export type ClassroomOption = Prisma.ClassroomGetPayload<{
  select: {
    id: true;
    name: true;
  };
}>;

export type ClassroomWithStudentCount = Prisma.ClassroomGetPayload<{
  include: {
    _count: {
      select: {
        students: true;
      };
    };
  };
}>;
