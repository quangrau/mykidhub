"use client";

import { useSession } from "next-auth/react";

export default function User() {
  const session = useSession();
  return (
    <div>
      <h2>Client Session</h2>
      <pre>{JSON.stringify(session, undefined, 2)}</pre>
    </div>
  );
}
