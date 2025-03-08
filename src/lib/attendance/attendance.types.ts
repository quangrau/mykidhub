import { Prisma } from "@prisma/client";

export const studentAttendanceQuery = {
  include: {
    student: true,
    recordedBy: {
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
    // checkInGuardian: {
    //   include: {
    //     id: true,
    //     member: {
    //       include: {
    //         user: {
    //           select: {
    //             id: true,
    //             name: true,
    //           },
    //         },
    //       },
    //     },
    //   },
    // },
    // checkOutGuardian: {
    //   select: {
    //     id: true,
    //   },
    //   include: {
    //     member: {
    //       include: {
    //         user: {
    //           select: {
    //             id: true,
    //             name: true,
    //           },
    //         },
    //       },
    //     },
    //   },
    // },
  },
};

export type StudentAttendance = Prisma.AttendanceGetPayload<
  typeof studentAttendanceQuery
>;
