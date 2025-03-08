import { auth } from "@/lib/auth/auth.server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getSession() {
  try {
    const data = await auth.api.getSession({
      headers: await headers(),
    });

    if (!data || !data.session) {
      redirect("/sign-in");
    }

    if (!data.session.activeOrganizationId) {
      // TODO: redirect to organization selection
      redirect("/sign-in");
    }

    return data as typeof auth.$Infer.Session & {
      session: {
        activeOrganizationId: string;
        memberId: string;
        role: string;
      };
    };
  } catch (error) {
    console.log("Error getting session", error);
    await auth.api.signOut({
      headers: await headers(),
    });

    redirect("/sign-in");
  }
}
