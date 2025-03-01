import useDialogState from "@/hooks/use-dialog-state";
import { Classroom } from "@prisma/client";
import React, { useState } from "react";

type ClassroomsDialogType = "add" | "edit" | "delete";

interface ClassroomsContextType {
  open: ClassroomsDialogType | null;
  setOpen: (str: ClassroomsDialogType | null) => void;
  currentRow: Classroom | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Classroom | null>>;
}

const ClassroomsContext = React.createContext<ClassroomsContextType | null>(
  null
);

interface Props {
  children: React.ReactNode;
}

export default function ClassroomsProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<ClassroomsDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Classroom | null>(null);

  return (
    <ClassroomsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ClassroomsContext>
  );
}

export const useClassrooms = () => {
  const classroomsContext = React.useContext(ClassroomsContext);

  if (!classroomsContext) {
    throw new Error("useClassrooms has to be used within <ClassroomsContext>");
  }

  return classroomsContext;
};
