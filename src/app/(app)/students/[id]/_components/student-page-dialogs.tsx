import { useStudentPage } from "../_context/student-page-context";
import { AttendanceAddDialog } from "./attendance-add-dialogs";
import { AbsenceAddDialog } from "./absence-add-dialog";

export function StudentPageDialogs() {
  const { open, setOpen, currentStudent, currentStudentAttendance } =
    useStudentPage();

  return (
    <>
      <AttendanceAddDialog
        key="add-attendance"
        open={open === "add-attendance"}
        onOpenChange={() => setOpen("add-attendance")}
        student={currentStudent}
      />

      <AbsenceAddDialog
        key="add-absence"
        open={open === "add-absence"}
        onOpenChange={() => setOpen("add-absence")}
        student={currentStudent}
      />

      {currentStudentAttendance && (
        <AttendanceAddDialog
          key={`edit-attendance-${currentStudentAttendance.id}`}
          open={open === "edit-attendance"}
          onOpenChange={() => setOpen("edit-attendance")}
          student={currentStudent}
          currentRow={currentStudentAttendance}
        />
      )}
    </>
  );
}
