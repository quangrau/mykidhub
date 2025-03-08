"use client";

import { Frame, Map, Newspaper, PieChart, School } from "lucide-react";

import { NavMain } from "@/components/layout/nav-main";
// import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/layout/nav-user";
import { SchoolBrand } from "@/components/layout/school-brand";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Organization, User } from "@prisma/client";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  school: {
    id: "1",
    name: "My Kid Hub",
  },
  navMain: [
    {
      groupKey: "school",
      items: [
        {
          title: "My School",
          icon: School,
          items: [
            {
              title: "Students",
              url: "/students",
            },
            {
              title: "Guardians",
              url: "/guardians",
            },
            {
              title: "Classrooms",
              url: "/classrooms",
            },
            {
              title: "Programs",
              url: "/programs",
            },
            {
              title: "Staff",
              url: "/staff",
            },
          ],
        },
      ],
    },
    {
      title: "General",
      groupKey: "general",
      items: [
        {
          title: "Feed",
          url: "/feed",
          icon: Newspaper,
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  school: Organization;
  user: User;
}

export function AppSidebar({ user, school, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SchoolBrand name={school?.name} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
