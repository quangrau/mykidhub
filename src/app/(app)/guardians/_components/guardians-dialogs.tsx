import { useGuardians } from "../_context/guardians-context";
import { GuardiansDeleteDialog } from "./guardians-delete-dialog";
import { GuardiansInviteDialog } from "./guardians-invite-dialog";
// import { GuardiansDeleteDialog } from "./guardian-delete-dialog";

export function GuardiansDialogs() {
  const { open, setOpen, currentRow } = useGuardians();

  if (!currentRow) {
    return null;
  }

  return (
    <>
      <GuardiansDeleteDialog
        key="guardian-delete"
        open={open === "delete"}
        onOpenChange={() => setOpen("delete")}
        currentRow={currentRow}
      />
      <GuardiansInviteDialog
        key="guardian-invite"
        open={open === "invite"}
        onOpenChange={() => setOpen("invite")}
        currentRow={currentRow}
      />
    </>
  );
}
