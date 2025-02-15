import { ClassroomService } from "@/lib/classroom/classroom.service";
import { getUserSession } from "@/lib/session";
import { AddClassroomModal } from "./_components/add-classroom-modal";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

export default async function ClassroomsPage() {
  const user = await getUserSession();
  const schoolId = user?.schoolId;
  const classrooms = await ClassroomService.getBySchoolId(schoolId!);

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
