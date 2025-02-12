import { getUserSession } from "@/lib/auth";
import { classroomService } from "@/services/classroom";
import { staffService } from "@/services/staff";
import { AddStaffModal } from "./_components/add-staff-modal";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

export default async function StaffPage() {
  const user = await getUserSession();
  const schoolId = user?.schoolId;
  const classrooms = await classroomService.getClassroomOptions(schoolId!);
  const staffs = await staffService.getStaffBySchoolId(schoolId!);

  console.log(staffs);

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

      <DataTable data={staffs} columns={columns} />
    </>
  );
}
