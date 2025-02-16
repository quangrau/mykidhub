import { Prisma } from "@prisma/client";

export const guardianWithStudentsQuery = {
  include: {
    guardianOf: {
      include: {
        student: true,
      },
    },
  },
} as const;

export type GuardianWithStudents = Prisma.UserGetPayload<
  typeof guardianWithStudentsQuery
>;

export const guardianOptionQuery = {
  select: {
    id: true,
    name: true,
    email: true,
  },
} as const;

export type GuardianOption = Prisma.UserGetPayload<typeof guardianOptionQuery>;

export const studentGuardianQuery = {
  include: {
    guardian: {
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    },
    student: true,
  },
} as const;

export type StudentGuardianWithRelations = Prisma.StudentGuardianGetPayload<
  typeof studentGuardianQuery
>;

export interface GuardianFilterOptions {
  status?: number;
  orderBy?: string;
  order?: "asc" | "desc";
}
