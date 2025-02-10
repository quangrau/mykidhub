import { getUserSession } from "@/lib/auth";
import { classroomService } from "@/services/classroom";
import { AddStaffModal } from "./components/add-staff-modal";
// import { columns } from "./components/columns";
// import { DataTable } from "./components/data-table";

export default async function StaffPage() {
  const user = await getUserSession();
  const schoolId = user?.schoolId;

  const classrooms = await classroomService.getClassroomOptions(schoolId!);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between pb-8 gap-x-4 space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Staff</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of all staff members in your school.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <AddStaffModal classrooms={classrooms} />
        </div>
      </div>

      {/* <DataTable data={[]} columns={columns} /> */}
    </>
  );
}
