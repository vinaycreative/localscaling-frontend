"use client";
import * as React from "react";
import { FolderClosedIcon, Home, LifeBuoy, Plus, Send } from "lucide-react";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator
} from "@/components/ui/sidebar";
import { NavSecondary } from "./nav-secondary";
import Image from "next/image";
import { NavMain } from "./nav-main";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg"
  },

  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send
    }
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-sidebar-border h-16 border-b">
        <div className="flex h-full w-full items-center justify-start">
          <Image width={100} height={50} src="/logo.svg" alt="Logo" className="w-40" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
