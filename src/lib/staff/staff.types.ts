import { Prisma } from "@prisma/client";

export type StaffCreateData = {
  name: string;
  email: string;
  phone?: string;
  role: "SCHOOL_ADMIN" | "TEACHER";
  schoolId: string;
  classroomIds?: string[];
};

export const staffWithClassroomsQuery =
  Prisma.validator<Prisma.UserDefaultArgs>()({
    include: {
      assignedClassrooms: {
        include: {
          classroom: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

export type StaffWithClassrooms = Prisma.UserGetPayload<
  typeof staffWithClassroomsQuery
>;
