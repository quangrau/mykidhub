import { Badge } from "@/components/ui/badge";
import { StaffWithClassrooms } from "@/lib/staff/staff.types";

type Props = {
  classrooms: StaffWithClassrooms["assignedClassrooms"];
};

export default function ClassroomCell({ classrooms }: Props) {
  if (!classrooms?.length) {
    return <span>--</span>;
  }

  return (
    <div className="flex gap-1">
      {classrooms.map((item) => (
        <Badge key={item.classroom.id} variant="outline">
          {item.classroom.name}
        </Badge>
      ))}
    </div>
  );
}
