import { db } from "@/lib/database/prisma.service";
import { studentAttendanceQuery } from "./attendance.types";

class AttendanceServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AttendanceServiceError";
  }
}

export class AttendanceService {
  static async getAttendanceByStudentId(studentId: string) {
    try {
      const attendance = await db.attendance.findMany({
        where: {
          studentId: studentId,
        },
        ...studentAttendanceQuery,
        orderBy: {
          createdAt: "desc",
        },
      });

      return attendance;
    } catch (error) {
      throw new AttendanceServiceError(
        `Failed to fetch attendance records: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  static async editAttendance({
    id,
    date,
    checkIn,
    checkOut,
    recordedById,
  }: {
    id: string;
    date: Date;
    checkIn?: Date;
    checkOut?: Date;
    recordedById: string;
  }) {
    try {
      const attendance = await db.attendance.update({
        where: { id },
        data: {
          date,
          checkIn,
          checkOut,
          recordedById,
        },
        ...studentAttendanceQuery,
      });

      return attendance;
    } catch (error) {
      throw new AttendanceServiceError(
        `Failed to update attendance record: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  static async createAttendance({
    studentId,
    date,
    checkIn,
    checkOut,
    recordedById,
  }: {
    studentId: string;
    date: Date;
    checkIn?: Date;
    checkOut?: Date;
    recordedById: string;
  }) {
    try {
      const attendance = await db.attendance.create({
        data: {
          studentId,
          date,
          checkIn,
          checkOut,
          recordedById,
        },
        ...studentAttendanceQuery,
      });

      return attendance;
    } catch (error) {
      throw new AttendanceServiceError(
        `Failed to create attendance record: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
