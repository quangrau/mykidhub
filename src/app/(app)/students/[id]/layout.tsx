import { ReactNode } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StudentService } from "@/lib/student/student.service";
import { StudentPageNav } from "./_components/student-page-nav";

interface StudentLayoutProps {
  children: ReactNode;
  params: {
    id: string;
  };
}

export default async function StudentLayout({
  children,
  params,
}: StudentLayoutProps) {
  const { id } = await params;
  const student = await StudentService.getStudent(id);

  return (
    <div className="flex flex-col pb-8 gap-x-4 space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-wrap items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">
              {student.name}
            </h1>
            <p className="text-muted-foreground">
              {student.classroom?.name || "No Classroom Assigned"}
            </p>
          </div>
          <div className="flex space-x-2">{/* <Button>Edit</Button> */}</div>
        </div>
      </div>
      <div className="border-grid border-t border-b border-dashed">
        <div className="container-wrapper">
          <div className="container py-4">
            <StudentPageNav id={id} />
          </div>
        </div>
      </div>

      <div className="space-y-4">{children}</div>
    </div>
  );
}
