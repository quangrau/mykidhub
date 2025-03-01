import { ClassroomService } from "@/lib/classroom/classroom.service";
import { StaffService } from "@/lib/staff/staff.service";
import StaffClientPage from "./page.client";

export default async function StaffPage() {
  const classrooms = await ClassroomService.getOptions();
  const data = await StaffService.getStaffsWithStatus();

  return <StaffClientPage classrooms={classrooms} data={data} />;
}
