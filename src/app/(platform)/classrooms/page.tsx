import { getSchoolSession } from "@/lib/session";
import { classroomService } from "@/services/classroom";
import { AddClassroomModal } from "./components/add-classroom-modal";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

export default async function ClassroomsPage() {
  const school = await getSchoolSession();
  const schoolId = school?.id;
  const classrooms = await classroomService.findClassroomsBySchoolId(schoolId!);

  return (
    <>
      <div className="flex items-center justify-between pb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Classrooms</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of all classrooms in your school.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <AddClassroomModal />
        </div>
      </div>

      <DataTable data={classrooms} columns={columns} />
    </>
  );
}
