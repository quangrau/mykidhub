import React, { useState } from "react";

import useDialogState from "@/hooks/use-dialog-state";
import type { GuardianWithStatus } from "@/lib/guardian/guardian.types";

type GuardiansDialogType = "invite" | "add" | "edit" | "delete";

interface GuardiansContextType {
  open: GuardiansDialogType | null;
  setOpen: (str: GuardiansDialogType | null) => void;
  currentRow: GuardianWithStatus | null;
  setCurrentRow: React.Dispatch<
    React.SetStateAction<GuardianWithStatus | null>
  >;
}

const GuardiansContext = React.createContext<GuardiansContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export default function GuardiansProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<GuardiansDialogType>(null);
  const [currentRow, setCurrentRow] = useState<GuardianWithStatus | null>(null);

  return (
    <GuardiansContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </GuardiansContext>
  );
}

export const useGuardians = () => {
  const guardiansContext = React.useContext(GuardiansContext);

  if (!guardiansContext) {
    throw new Error("useGuardians has to be used within <GuardiansContext>");
  }

  return guardiansContext;
};
