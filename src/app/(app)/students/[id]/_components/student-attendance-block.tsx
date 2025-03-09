import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { StudentAttendance } from "@/lib/attendance/attendance.types";
import { useStudentPage } from "../_context/student-page-context";
import { columns } from "./student-attendance-columns";
import { StudentAttendanceTable } from "./student-attendance-table";

interface Props {
  attendance: StudentAttendance[];
}

export default function StudentAttendanceBlock({ attendance }: Props) {
  const { setOpen } = useStudentPage();

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between">
          <div>
            <CardTitle className="text-lg">Attendance Log</CardTitle>
            <CardDescription>
              View daily records for this student&apos;s attendance
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="space-x-1"
              onClick={() => {
                setOpen("add-absence");
              }}
            >
              <span>Add absence</span>
            </Button>
            <Button
              variant="ghost"
              className="space-x-1"
              onClick={() => {
                setOpen("add-attendance");
              }}
            >
              <span>Add attendance</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <StudentAttendanceTable data={attendance} columns={columns} />
      </CardContent>
    </Card>
  );
}
