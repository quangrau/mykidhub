import { ClassroomOption } from "@/lib/classroom/classroom.types";
import { GuardianOption } from "@/lib/guardian/guardian.types";
import { useStudents } from "../_context/students-context";
import { StudentsActionDialog } from "./students-action-dialog";
import { StudentsDisableDialog } from "./students-disable-dialog";

interface Props {
  classrooms: ClassroomOption[];
  guardians: GuardianOption[];
}

export function StudentsDialogs({ classrooms, guardians }: Props) {
  const { open, setOpen, currentRow } = useStudents();

  return (
    <>
      <StudentsActionDialog
        key="students-add"
        open={open === "add"}
        onOpenChange={() => setOpen("add")}
        classrooms={classrooms}
        guardians={guardians}
      />

      {currentRow && (
        <>
          <StudentsActionDialog
            key="students-edit"
            open={open === "edit"}
            onOpenChange={() => setOpen("edit")}
            currentRow={currentRow}
            classrooms={classrooms}
            guardians={guardians}
          />
          <StudentsDisableDialog
            key="students-delete"
            open={open === "delete"}
            onOpenChange={() => setOpen("delete")}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  );
}
