import { prisma } from "@/lib/prisma";

export const classroomService = {
  findClassroomsBySchoolId: async (schoolId: string) => {
    return prisma.classroom.findMany({
      where: {
        schoolId,
      },
      orderBy: {
        name: "asc",
      },
    });
  },
};
