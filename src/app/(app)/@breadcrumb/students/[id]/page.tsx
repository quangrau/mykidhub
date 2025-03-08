import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { StudentService } from "@/lib/student/student.service";

export default async function BreadcrumbSlot({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const student = await StudentService.getStudentBasicInfo(id);

  return (
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="/">My School</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink href="/students">Students</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage className="capitalize">{student.name}</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  );
}
