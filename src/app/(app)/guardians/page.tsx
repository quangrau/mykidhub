import { GuardianService } from "@/lib/guardian/guardian.service";
import GuardiansClientPage from "./page.client";

export default async function GuardiansPage() {
  const guardians = await GuardianService.getGuardiansWithStatus();

  return <GuardiansClientPage data={guardians} />;
}
