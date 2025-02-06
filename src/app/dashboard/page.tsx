import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import User from "./user";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <form action="/api/auth/signout" method="post">
          <Button variant="outline" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </form>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Welcome, {session?.user?.name || "User"}!
        </h2>
        <div className="space-y-4">
          <pre>{JSON.stringify(session, undefined, 2)}</pre>
        </div>
        <User />
      </div>
    </div>
  );
}
