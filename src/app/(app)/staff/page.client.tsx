"use client";

import { ClassroomOption } from "@/lib/classroom/classroom.types";
import type { StaffWithStatus } from "@/lib/staff/staff.types";
import { columns } from "./_components/staff-columns";
import { StaffDialogs } from "./_components/staff-dialogs";
import { StaffPrimaryButtons } from "./_components/staff-primary-buttons";
import { StaffTable } from "./_components/staff-table";
import StaffProvider from "./_context/staff-context";

interface StaffClientPageProps {
  data: StaffWithStatus[];
  classrooms: ClassroomOption[];
}

export default function StaffClientPage({
  data,
  classrooms,
}: StaffClientPageProps) {
  return (
    <StaffProvider>
      <div className="flex flex-wrap items-center justify-between pb-8 gap-x-4 space-y-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Staff</h1>
          <p className="text-muted-foreground">
            Here&apos;s a list of all staff members in your school.
          </p>
        </div>
        <StaffPrimaryButtons />
      </div>
      <StaffTable data={data} columns={columns} />
      <StaffDialogs classrooms={classrooms} />
    </StaffProvider>
  );
}
