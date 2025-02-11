"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/use-current-user";

export function User() {
  const user = useCurrentUser();

  return (
    <Card>
      <CardHeader>Client</CardHeader>
      <CardContent>
        <pre>{JSON.stringify(user, undefined, 2)}</pre>
      </CardContent>
    </Card>
  );
}
