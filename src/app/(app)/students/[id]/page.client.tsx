"use client";

import { SquarePen } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { StudentAttendance } from "@/lib/attendance/attendance.types";
import type { GuardianWithStatus } from "@/lib/guardian/guardian.types";
import { Student } from "@prisma/client";
import StudentAttendanceBlock from "./_components/student-attendance-block";
import StudentGuardiansBlock from "./_components/student-guardians-block";
import { StudentPageDialogs } from "./_components/student-page-dialogs";
import StudentPageProvider from "./_context/student-page-context";

interface StudentClientPageProps {
  student: Student;
  guardians: GuardianWithStatus[];
  attendance: StudentAttendance[];
}

export default function StudentClientPage({
  student,
  guardians,
  attendance,
}: StudentClientPageProps) {
  return (
    <div className="flex flex-col space-y-6">
      <StudentPageProvider student={student}>
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between">
              <div>
                <CardTitle className="text-lg">Personal Information</CardTitle>
                <CardDescription>Basic student information</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button className="space-x-1">
                  <SquarePen size={18} />
                  <span>Edit</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque
            voluptas repellat nihil eaque quisquam, facilis vitae cum ipsam?
            Atque reprehenderit rem sint quam officiis cum facere, ducimus hic
            tenetur laboriosam.
          </CardContent>
        </Card>

        <StudentGuardiansBlock guardians={guardians} />
        <StudentAttendanceBlock attendance={attendance} />
        <StudentPageDialogs />
      </StudentPageProvider>
    </div>
  );
}
