import { ClassroomOption } from "@/lib/classroom/classroom.types";
import { useStaff } from "../_context/staff-context";
import { StaffActionDialog } from "./staff-action-dialog";
import { StaffDeleteDialog } from "./staff-delete-dialog";
import { StaffInviteDialog } from "./staff-invite-dialog";

interface Props {
  classrooms: ClassroomOption[];
}

export function StaffDialogs({ classrooms }: Props) {
  const { open, setOpen, currentRow } = useStaff();

  return (
    <>
      <StaffActionDialog
        key="staff-add"
        open={open === "add"}
        onOpenChange={() => setOpen("add")}
        classrooms={classrooms}
      />

      {currentRow && (
        <>
          <StaffActionDialog
            key="staff-edit"
            open={open === "edit"}
            onOpenChange={() => setOpen("edit")}
            currentRow={currentRow}
            classrooms={classrooms}
          />
          <StaffDeleteDialog
            key="staff-delete"
            open={open === "delete"}
            onOpenChange={() => setOpen("delete")}
            currentRow={currentRow}
          />
          <StaffInviteDialog
            key="staff-invite"
            open={open === "invite"}
            onOpenChange={() => setOpen("invite")}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  );
}
