import { Prisma } from "@prisma/client";

export const userWithSchoolQuery = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    school: {
      select: {
        id: true,
        name: true,
      },
    },
  },
});

export type UserWithSchool = Prisma.UserGetPayload<typeof userWithSchoolQuery>;
