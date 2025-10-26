"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ChevronRight, FolderClosedIcon, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "../ui/badge";

const items = [
  {
    name: "Business Information",
    count: 18,
    href: "/tasks/business-information",
  },
  { name: "Branding & Content", count: 8, href: "/tasks/branding-content" },
  { name: "Website Setup", count: 4, href: "/tasks/website-setup" },
  { name: "Tools Access", count: 4, href: "/tasks/tools-access" },
  { name: "Locations & Budget", count: 4, href: "/tasks/locations-budget" },
];
export function NavMain() {
  const pathName = usePathname();
  return (
    <SidebarMenu>
      <SidebarMenuItem className="px-2">
        <SidebarMenuButton asChild className="cursor-pointer rounded">
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
            className="group/label mb-2 cursor-pointer rounded text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full text-sm"
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
                {items.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex justify-between px-2 py-1 rounded hover:text-foreground hover:bg-muted transition-all duration-300 ${pathName.includes(item.href) ? "bg-muted text-foreground" : "text-muted-foreground"}`}
                    >
                      {item.name}
                      <Badge
                        variant={"outline"}
                        className="border-0 text-destructive/60 bg-destructive/10 rounded-lg"
                      >
                        {item.count}
                      </Badge>
                    </Link>
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
