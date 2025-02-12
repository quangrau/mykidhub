import { Button } from "@/components/ui/button";
import { ClassroomService } from "@/lib/classroom/classroom.service";
import { getUserSession } from "@/lib/session";
import { StudentService } from "@/lib/student/student.service";
import { ImportIcon } from "lucide-react";
import { AddStudentModal } from "./components/add-student-modal";

export default async function StudentsPage() {
  const user = await getUserSession();
  const schoolId = user?.schoolId;

  const students = await StudentService.getBySchoolId(schoolId!);
  const classrooms = await ClassroomService.getOptions(schoolId!);
  console.log(students);

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

      {/* <DataTable data={students} columns={columns} /> */}
    </>
  );
}
