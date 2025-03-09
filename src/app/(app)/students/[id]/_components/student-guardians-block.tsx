import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { GuardianWithStatus } from "@/lib/guardian/guardian.types";
import { useStudentPage } from "../_context/student-page-context";
import { StudentGuardiansTable } from "./student-guardians-table";

interface Props {
  guardians: GuardianWithStatus[];
}

export default function StudentGuardiansBlock({ guardians }: Props) {
  const { setOpen } = useStudentPage();

  return (
    <Card>
      <CardHeader className="grid grid-cols-2">
        <div>
          <CardTitle className="text-lg">Guardians</CardTitle>
          <CardDescription>
            These are people authorized to pick up this student. Parents can
            sign up a few different ways. Check out our Parent Onboarding Guide
            for more help.
          </CardDescription>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              setOpen("add-guardian");
            }}
          >
            Add Guardian
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <StudentGuardiansTable data={guardians} />
      </CardContent>
    </Card>
  );
}
