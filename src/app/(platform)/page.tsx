import { User } from "@/components/user";
import { getUserSession } from "@/lib/session";
export default async function Home() {
  const userSession = await getUserSession();
  console.log("Dashboard", { userSession });

  return (
    <>
      <h1 className="text-2xl font-bold">Server</h1>
      <pre>{JSON.stringify(userSession, null, 2)}</pre>
      <User />

      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </>
  );
}
