import { Button } from "@/components/ui/button";
import { ClassroomService } from "@/lib/classroom/classroom.service";
import { GuardianService } from "@/lib/guardian/guardian.service";
import { getUserSession } from "@/lib/session";
import { StudentService } from "@/lib/student/student.service";
import { ImportIcon } from "lucide-react";
import { AddStudentModal } from "./_components/add-student-modal";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

export default async function StudentsPage() {
  const user = await getUserSession();
  const schoolId = user?.schoolId;

  const students = await StudentService.getBySchoolId(schoolId!);
  const classrooms = await ClassroomService.getOptions(schoolId!);
  const guardians = await GuardianService.getGuardianOptions(schoolId!);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between pb-8 gap-x-4 space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Students</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of all students in your school.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="secondary">
            Import
            <ImportIcon />
          </Button>
          <AddStudentModal classrooms={classrooms} guardians={guardians} />
        </div>
      </div>

      <DataTable data={students} columns={columns} />
    </>
  );
}
