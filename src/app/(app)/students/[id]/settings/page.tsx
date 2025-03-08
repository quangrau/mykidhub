import { StudentService } from "@/lib/student/student.service";

interface SettingsPageProps {
  params: {
    id: string;
  };
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { id } = await params;
  const student = await StudentService.getStudent(id);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Student Settings</h3>
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Student Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue={student.name}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="birthDate"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Birth Date
                </label>
                <input
                  id="birthDate"
                  type="date"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue={
                    student.birthDate
                      ? new Date(student.birthDate).toISOString().split("T")[0]
                      : ""
                  }
                  disabled
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="medicalNotes"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Medical Notes
                </label>
                <textarea
                  id="medicalNotes"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue={student.medicalNotes || ""}
                  disabled
                />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Settings management feature is coming soon. You&apos;ll be able to
              update student information here.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
