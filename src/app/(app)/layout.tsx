import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Providers } from "@/components/providers";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SchoolService } from "@/lib/school/school.service";
import { getSession } from "@/lib/utils/session";
import { Organization, User } from "@prisma/client";
import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "My Kid Hub",
  description: "Generated by create next app",
};

export default async function PlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await getSession();
  const user = data?.user as User;
  const school = (await SchoolService.findSchoolById(
    data?.session.activeOrganizationId || ""
  )) as Organization;

  return (
    <Providers>
      <SidebarProvider>
        <AppSidebar school={school} user={user} />
        <SidebarInset>
          <>
            <AppHeader />
            <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
          </>
        </SidebarInset>
      </SidebarProvider>
    </Providers>
  );
}
