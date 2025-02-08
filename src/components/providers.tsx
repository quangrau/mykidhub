"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";
import { QueryProvider } from "./query-provider";

interface Props {
  children?: React.ReactNode;
}

export function Providers({ children }: Props) {
  return (
    <SessionProvider>
      <QueryProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </QueryProvider>
    </SessionProvider>
  );
}
