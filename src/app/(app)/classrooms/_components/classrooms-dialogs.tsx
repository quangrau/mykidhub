import { useClassrooms } from "../_context/classrooms-context";
import { ClassroomsActionDialog } from "./classrooms-action-dialog";
import { ClassroomsDeleteDialog } from "./classrooms-delete-dialog";

export function ClassroomsDialogs() {
  const { open, setOpen, currentRow } = useClassrooms();

  return (
    <>
      <ClassroomsActionDialog
        key="classrooms-add"
        open={open === "add"}
        onOpenChange={() => setOpen("add")}
      />

      {currentRow && (
        <>
          <ClassroomsActionDialog
            key="classrooms-edit"
            open={open === "edit"}
            onOpenChange={() => setOpen("edit")}
            currentRow={currentRow}
          />
          <ClassroomsDeleteDialog
            key="classrooms-delete"
            open={open === "delete"}
            onOpenChange={() => setOpen("delete")}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  );
}
