import { useSession } from "next-auth/react";

export function useUserSession() {
  const { data: session } = useSession();
  return session?.user;
}
