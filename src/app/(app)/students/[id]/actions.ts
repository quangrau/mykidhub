"use server";

import { AttendanceService } from "@/lib/attendance/attendance.service";
import { getSession } from "@/lib/utils/session";
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

export async function createAttendanceAction(
  studentId: string,
  data: CreateAttendanceData
) {
  try {
    const { session } = await getSession();
    const memberId = session.memberId;

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

    const attendance = await AttendanceService.createAttendance({
      studentId,
      date: baseDate,
      checkIn,
      checkOut,
      recordedById: memberId,
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

export async function editAttendanceAction(
  studentId: string,
  data: EditAttendanceData
) {
  try {
    const { session } = await getSession();
    const memberId = session.memberId;

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
      recordedById: memberId,
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
