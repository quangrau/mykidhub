import { Button } from "@/components/ui/button";
import { ImportIcon, UserPlus } from "lucide-react";
import { useStudents } from "../_context/students-context";

export function StudentsPrimaryButtons() {
  const { setOpen } = useStudents();

  return (
    <div className="flex gap-2">
      <Button variant="outline" className="space-x-1">
        <span>Import</span> <ImportIcon size={18} />
      </Button>
      <Button className="space-x-1" onClick={() => setOpen("add")}>
        <span>Add Student</span> <UserPlus size={18} />
      </Button>
    </div>
  );
}
