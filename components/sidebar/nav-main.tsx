"use client";

import { FolderClosedIcon, Home, type LucideIcon } from "lucide-react";

import { Check, ChevronRight } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator
} from "@/components/ui/sidebar";
import Link from "next/link";

const items = [
  { name: "Business Information", count: 18 },
  { name: "Branding & Content", count: 8 },
  { name: "Website Setup", count: 4 },
  { name: "Tracking & Analytics", count: 4 },
  { name: "CRM Setup", count: 4 },
  { name: "Google Ads Setup", count: 4 },
  { name: "Reviews & Reputation", count: 4 },
  { name: "Project Reporting", count: 4 }
];
export function NavMain() {
  return (
    <SidebarMenu>
      <SidebarMenuItem className="px-2">
        <SidebarMenuButton asChild isActive={false}>
          <Link href="/dashboard">
            <Home />
            <span>Dashboard</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarGroup className="py-0">
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroupLabel
            asChild
            className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full text-sm"
          >
            <CollapsibleTrigger className="">
              <FolderClosedIcon className="mr-2" />
              Tasks
              <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item, index) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton>{item.name}</SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </CollapsibleContent>
        </Collapsible>
      </SidebarGroup>
    </SidebarMenu>
  );
}
