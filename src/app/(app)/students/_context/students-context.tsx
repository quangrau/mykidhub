import useDialogState from "@/hooks/use-dialog-state";
import { Student } from "@prisma/client";
import React, { useState } from "react";

type StudentsDialogType = "invite" | "add" | "edit" | "delete";

interface StudentsContextType {
  open: StudentsDialogType | null;
  setOpen: (str: StudentsDialogType | null) => void;
  currentRow: Student | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Student | null>>;
}

const StudentsContext = React.createContext<StudentsContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export default function StudentsProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<StudentsDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Student | null>(null);

  return (
    <StudentsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </StudentsContext>
  );
}

export const useStudents = () => {
  const studentsContext = React.useContext(StudentsContext);

  if (!studentsContext) {
    throw new Error("useStudents has to be used within <StudentsContext>");
  }

  return studentsContext;
};
