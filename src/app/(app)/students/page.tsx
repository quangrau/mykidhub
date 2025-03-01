import { ClassroomService } from "@/lib/classroom/classroom.service";
import { GuardianService } from "@/lib/guardian/guardian.service";
import { StudentService } from "@/lib/student/student.service";
import StudentsClientPage from "./page.client";

export default async function StudentsPage() {
  const students = await StudentService.getStudents();
  const classrooms = await ClassroomService.getOptions();
  const guardians = await GuardianService.getGuardianOptions();

  return (
    <StudentsClientPage
      students={students}
      guardians={guardians}
      classrooms={classrooms}
    />
  );
}
