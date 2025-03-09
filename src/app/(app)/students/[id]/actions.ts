"use server";

import { AbsenceCreateData } from "@/lib/attendance/attendance.schema";
import { AttendanceService } from "@/lib/attendance/attendance.service";
import { revalidatePath } from "next/cache";

interface CreateAttendanceData {
  date: Date;
  checkIn?: string;
  checkOut?: string;
}

interface EditAttendanceData {
  id: string;
  date: Date;
  checkIn?: string;
  checkOut?: string;
}

type ActionResponse = {
  success: boolean;
  message: string;
};

export async function createAttendanceAction(
  studentId: string,
  data: CreateAttendanceData
): Promise<ActionResponse> {
  try {
    // Convert date to local date string to ensure consistent date handling
    const baseDate = new Date(data.date);
    const datePart = baseDate.toISOString().split("T")[0];

    // Combine date with check-in time if provided
    const checkIn = data.checkIn
      ? new Date(`${datePart}T${data.checkIn}`)
      : undefined;

    // Combine date with check-out time if provided
    const checkOut = data.checkOut
      ? new Date(`${datePart}T${data.checkOut}`)
      : undefined;

    await AttendanceService.createAttendance({
      studentId,
      date: baseDate,
      checkIn,
      checkOut,
    });

    revalidatePath(`/students/${studentId}`);

    return {
      success: true,
      message: "Attendance recorded successfully",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to record attendance",
    };
  }
}

export async function editAttendanceAction(
  studentId: string,
  data: EditAttendanceData
) {
  try {
    // Convert date to local date string to ensure consistent date handling
    const baseDate = new Date(data.date);
    const datePart = baseDate.toISOString().split("T")[0];

    // Combine date with check-in time if provided
    const checkIn = data.checkIn
      ? new Date(`${datePart}T${data.checkIn}`)
      : undefined;

    // Combine date with check-out time if provided
    const checkOut = data.checkOut
      ? new Date(`${datePart}T${data.checkOut}`)
      : undefined;

    const attendance = await AttendanceService.editAttendance({
      id: data.id,
      date: baseDate,
      checkIn,
      checkOut,
    });

    revalidatePath(`/students/${studentId}`);

    return {
      success: true,
      message: "Attendance recorded successfully",
      data: attendance,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to record attendance",
    };
  }
}

export async function createAbsenceAction(
  studentId: string,
  data: AbsenceCreateData
): Promise<ActionResponse> {
  try {
    await AttendanceService.createAbsence(studentId, data);

    revalidatePath(`/students/${studentId}`);

    return {
      success: true,
      message: "Absence recorded successfully",
    };
  } catch (error) {
    console.error("Failed to create absence:", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to record absence",
    };
  }
}
