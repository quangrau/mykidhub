"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { authClient } from "@/lib/auth/auth.client";

export function User() {
  const { data: session } = authClient.useSession();
  console.log(session);

  return (
    <Card>
      <CardHeader>Client</CardHeader>
      <CardContent>
        <pre>{JSON.stringify(session, undefined, 2)}</pre>
      </CardContent>
    </Card>
  );
}
