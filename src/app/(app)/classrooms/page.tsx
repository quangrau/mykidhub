import { ClassroomService } from "@/lib/classroom/classroom.service";
import { getSession } from "@/lib/utils/session";
import ClassroomsClientPage from "./page.client";

export default async function ClassroomsPage() {
  const data = await getSession();
  const schoolId = data?.session.activeOrganizationId;
  const classrooms = await ClassroomService.getBySchoolId(schoolId!);

  return (
    <>
      <ClassroomsClientPage classrooms={classrooms} />
    </>
  );
}
