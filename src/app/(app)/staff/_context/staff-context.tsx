import React, { useState } from "react";

import useDialogState from "@/hooks/use-dialog-state";
import type { StaffWithStatus } from "@/lib/staff/staff.types";

type StaffDialogType = "invite" | "add" | "edit" | "delete";

interface StaffContextType {
  open: StaffDialogType | null;
  setOpen: (str: StaffDialogType | null) => void;
  currentRow: StaffWithStatus | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<StaffWithStatus | null>>;
}

const StaffContext = React.createContext<StaffContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export default function StaffProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<StaffDialogType>(null);
  const [currentRow, setCurrentRow] = useState<StaffWithStatus | null>(null);

  return (
    <StaffContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </StaffContext>
  );
}

export const useStaff = () => {
  const staffContext = React.useContext(StaffContext);

  if (!staffContext) {
    throw new Error("useStaff has to be used within <StaffContext>");
  }

  return staffContext;
};
