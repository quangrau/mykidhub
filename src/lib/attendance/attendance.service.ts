import { addDays, isWeekend } from "date-fns";

import { db } from "@/lib/database/prisma.service";
import { AttendanceStatus } from "@prisma/client";
import { getSession } from "../utils/session";
import { AbsenceCreateData } from "./attendance.schema";
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
          date: "desc",
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
  }: {
    id: string;
    date: Date;
    checkIn?: Date;
    checkOut?: Date;
  }) {
    try {
      const { session } = await getSession();
      const memberId = session.memberId;

      const attendance = await db.attendance.update({
        where: { id },
        data: {
          date,
          checkIn,
          checkOut,
          recordedById: memberId,
        },
        ...studentAttendanceQuery,
      });

      return attendance;
    } catch (error) {
      throw new AttendanceServiceError(
        `Failed to update attendance record: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  static async createAttendance({
    studentId,
    date,
    checkIn,
    checkOut,
  }: {
    studentId: string;
    date: Date;
    checkIn?: Date;
    checkOut?: Date;
  }) {
    try {
      const { session } = await getSession();
      const memberId = session.memberId;

      const attendance = await db.attendance.create({
        data: {
          studentId,
          date,
          checkIn,
          checkOut,
          recordedById: memberId,
        },
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

  static async createAbsence(studentId: string, data: AbsenceCreateData) {
    try {
      const { session } = await getSession();
      const memberId = session.memberId;

      const { date, endDate, notes, createWeekends } = data;
      const absences = [];

      if (endDate) {
        let currentDate = new Date(date);
        const end = new Date(endDate);

        while (currentDate <= end) {
          if (createWeekends || !isWeekend(currentDate)) {
            absences.push({
              date: currentDate,
              notes,
              studentId,
              recordedById: memberId,
              status: AttendanceStatus.ABSENT,
            });
          }
          currentDate = addDays(currentDate, 1);
        }

        return await db.attendance.createMany({
          data: absences,
        });
      }

      return await db.attendance.create({
        data: {
          date,
          notes,
          studentId,
          recordedById: memberId,
          status: AttendanceStatus.ABSENT,
        },
      });
    } catch (error) {
      console.error("Error creating absence:", error);
      throw new Error("Failed to create absence");
    }
  }
}
