import useDialogState from "@/hooks/use-dialog-state";
import { StudentAttendance } from "@/lib/attendance/attendance.types";
import { Student } from "@prisma/client";
import React, { useState } from "react";

type StudentPageDialogType =
  | "edit"
  | "add-guardian"
  | "add-attendance"
  | "edit-attendance"
  | "delete-attendance"
  | "add-absence";

interface StudentPageContextType {
  open: StudentPageDialogType | null;
  setOpen: (str: StudentPageDialogType | null) => void;
  currentStudent: Student;
  setCurrentStudent: React.Dispatch<React.SetStateAction<Student>>;
  currentStudentAttendance?: StudentAttendance;
  setCurrentStudentAttendance: React.Dispatch<
    React.SetStateAction<StudentAttendance | undefined>
  >;
}

const StudentPageContext = React.createContext<StudentPageContextType | null>(
  null
);

interface Props {
  children: React.ReactNode;
  student: Student;
}

export default function StudentPageProvider({ children, student }: Props) {
  const [open, setOpen] = useDialogState<StudentPageDialogType>(null);
  const [currentStudent, setCurrentStudent] = useState<Student>(student);
  const [currentStudentAttendance, setCurrentStudentAttendance] = useState<
    StudentAttendance | undefined
  >();

  return (
    <StudentPageContext
      value={{
        open,
        setOpen,
        currentStudent,
        setCurrentStudent,
        currentStudentAttendance,
        setCurrentStudentAttendance,
      }}
    >
      {children}
    </StudentPageContext>
  );
}

export const useStudentPage = () => {
  const _context = React.useContext(StudentPageContext);

  if (!_context) {
    throw new Error(
      "useStudentPage has to be used within <StudentPageContext>"
    );
  }

  return _context;
};
