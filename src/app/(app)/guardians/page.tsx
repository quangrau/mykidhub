import { GuardianService } from "@/lib/guardian/guardian.service";
import { getUserSession } from "@/lib/session";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

export default async function GuardiansPage() {
  const user = await getUserSession();
  const schoolId = user?.schoolId;
  const guardians = await GuardianService.getBySchoolId(schoolId!);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between pb-8 gap-x-4 space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Guardians</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of all guardians in your school.
          </p>
        </div>
      </div>

      <DataTable data={guardians} columns={columns} />
    </>
  );
}
