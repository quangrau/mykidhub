import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useClassrooms } from "../_context/classrooms-context";

export function ClassroomsPrimaryButtons() {
  const { setOpen } = useClassrooms();

  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpen("add")}>
        <span>Add Classroom</span> <UserPlus size={18} />
      </Button>
    </div>
  );
}
