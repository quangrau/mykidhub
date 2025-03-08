"use client";

import { SidebarProvider } from "@/components/ui/sidebar";

interface Props {
  children?: React.ReactNode;
}

export function Providers({ children }: Props) {
  return <SidebarProvider>{children}</SidebarProvider>;
}
