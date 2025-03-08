interface ImmunizationsPageProps {
  params: {
    id: string;
  };
}

export default async function ImmunizationsPage({
  params,
}: ImmunizationsPageProps) {
  const { id } = await params;
  console.log(id);
  // const student = await getStudent(id);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Immunization Records</h3>
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
              Add Record
            </button>
          </div>
          <div className="text-sm text-muted-foreground">
            This feature is coming soon. You&apos;ll be able to track and manage
            immunization records here.
          </div>
          <div className="rounded-md border border-dashed p-8 text-center">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-10 w-10 text-muted-foreground"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold">No records found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Add immunization records to track your student&apos;s
                vaccination history.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
