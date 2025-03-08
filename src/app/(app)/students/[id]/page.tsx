import { AttendanceService } from "@/lib/attendance/attendance.service";
import { GuardianService } from "@/lib/guardian/guardian.service";
import { StudentService } from "@/lib/student/student.service";
import StudentClientPage from "./page.client";

interface StudentPageProps {
  params: {
    id: string;
  };
}

export default async function StudentPage({ params }: StudentPageProps) {
  const { id } = await params;
  const student = await StudentService.getStudentBasicInfo(id);
  const guardians = await GuardianService.getGuardiansByStudentId(id);
  const attendance = await AttendanceService.getAttendanceByStudentId(id);

  return (
    <StudentClientPage
      student={student}
      guardians={guardians}
      attendance={attendance}
    />
  );
}
