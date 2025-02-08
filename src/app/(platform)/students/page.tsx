import { getServerSession } from "next-auth";

import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/session";
import { studentService } from "@/services/student";
import { ImportIcon, PlusIcon } from "lucide-react";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

export default async function StudentsPage() {
  const session = await getServerSession(authOptions);
  const schoolId = session?.user?.school?.id;
  const students = await studentService.findStudentsBySchoolId(schoolId!);

  console.log({ students });

  return (
    <>
      <div className="flex items-center justify-between pb-8">
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
          <Button>
            Add Student
            <PlusIcon />
          </Button>
        </div>
      </div>

      <DataTable data={[]} columns={columns} />
    </>
  );
}
