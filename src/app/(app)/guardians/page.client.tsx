"use client";

import type { GuardianWithStatus } from "@/lib/guardian/guardian.types";
import { columns } from "./_components/guardians-columns";
import { GuardiansDialogs } from "./_components/guardians-dialogs";
import { GuardiansTable } from "./_components/guardians-table";
import GuardiansProvider from "./_context/guardians-context";

interface GuardiansClientPageProps {
  data: GuardianWithStatus[];
}

export default function GuardiansClientPage({
  data,
}: GuardiansClientPageProps) {
  return (
    <GuardiansProvider>
      <div className="flex flex-wrap items-center justify-between pb-8 gap-x-4 space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Guardians</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of all guardians in your school.
          </p>
        </div>
      </div>

      <GuardiansTable data={data} columns={columns} />
      <GuardiansDialogs />
    </GuardiansProvider>
  );
}
