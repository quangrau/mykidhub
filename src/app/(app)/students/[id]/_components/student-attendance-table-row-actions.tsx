import { MoreHorizontal, SquarePen, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { StudentAttendance } from "@/lib/attendance/attendance.types";
import { Row } from "@tanstack/react-table";
import { useStudentPage } from "../_context/student-page-context";

interface StudentAttendanceTableRowActionsProps {
  row: Row<StudentAttendance>;
}

export function StudentAttendanceTableRowActions({
  row,
}: StudentAttendanceTableRowActionsProps) {
  const { setOpen, setCurrentStudentAttendance } = useStudentPage();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            setCurrentStudentAttendance(row.original);
            setOpen("edit-attendance");
          }}
        >
          <SquarePen />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => {
            setCurrentStudentAttendance(row.original);
            setOpen("delete-attendance");
          }}
        >
          <Trash />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
