import { useGuardians } from "../_context/guardians-context";
import { GuardiansDeleteDialog } from "./guardians-delete-dialog";
// import { GuardiansDeleteDialog } from "./guardian-delete-dialog";

export function GuardiansDialogs() {
  const { open, setOpen, currentRow } = useGuardians();

  if (!currentRow) {
    return null;
  }

  return (
    <>
      <GuardiansDeleteDialog
        key="staff-delete"
        open={open === "delete"}
        onOpenChange={() => setOpen("delete")}
        currentRow={currentRow}
      />
    </>
  );
}
