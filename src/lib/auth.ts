import { auth } from "@/auth";

export async function getUserSession() {
  try {
    const session = await auth();
    return session?.user;
  } catch {
    return undefined;
  }
}
