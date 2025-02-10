import { Button } from "@/components/ui/button";
import { getUserSession } from "@/lib/auth";
import { classroomService } from "@/services/classroom";
import { studentService } from "@/services/student";
import { ImportIcon } from "lucide-react";
import { AddStudentModal } from "./components/add-student-modal";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

export default async function StudentsPage() {
  const user = await getUserSession();
  const schoolId = user?.schoolId;

  const students = await studentService.getStudentsBySchoolId(schoolId!);
  const classrooms = await classroomService.getClassroomOptions(schoolId!);

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
          <AddStudentModal classrooms={classrooms} />
        </div>
      </div>

      <DataTable data={students} columns={columns} />
    </>
  );
}
