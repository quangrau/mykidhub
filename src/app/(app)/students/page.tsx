import { ClassroomService } from "@/lib/classroom/classroom.service";
import { GuardianService } from "@/lib/guardian/guardian.service";
import { getUserSession } from "@/lib/session";
import { StudentService } from "@/lib/student/student.service";
import StudentsClientPage from "./_components/students.client.page";

export default async function StudentsPage() {
  const user = await getUserSession();
  const schoolId = user?.schoolId;

  const students = await StudentService.getBySchoolId(schoolId!);
  const classrooms = await ClassroomService.getOptions(schoolId!);
  const guardians = await GuardianService.getGuardianOptions(schoolId!);

  return (
    <StudentsClientPage
      students={students}
      guardians={guardians}
      classrooms={classrooms}
    />
  );
}
