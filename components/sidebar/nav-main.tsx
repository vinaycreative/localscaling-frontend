"use client"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  ChartPie,
  ChevronRight,
  FolderClosedIcon,
  Home,
  Ticket,
  Server,
  ToggleRight,
  Users,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Badge } from "../ui/badge"
import { useAuth } from "@/hooks/use-auth"
import type { RoleValue } from "@/constants/auth"
import { Role } from "@/constants/auth"

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
]
type NavItem = {
  label: string
  href: string
  icon: React.ComponentType<any>
  roles: readonly string[]
}

const NAV_ITEMS: readonly NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: [Role.CLIENT, Role.SUPPORT_HEAD_ADMIN, Role.SUPPORT_ADMIN, Role.ADMIN],
  },
  {
    label: "Tickets",
    href: "/support",
    icon: Ticket,
    roles: [Role.SUPPORT_HEAD_ADMIN, Role.SUPPORT_ADMIN],
  },
  { label: "Projects", href: "/projects", icon: Server, roles: [Role.ADMIN] },
  { label: "Clients", href: "/clients", icon: Users, roles: [Role.ADMIN] },
  { label: "Tools", href: "/tools", icon: ToggleRight, roles: [Role.ADMIN] },
  { label: "Finance", href: "/finance", icon: ChartPie, roles: [Role.ADMIN] },
]

export function NavMain({ initialRole }: { initialRole?: RoleValue }) {
  const pathName = usePathname()
  const { user } = useAuth()
  const role = user?.role ?? initialRole
  if (!role) return null
  return (
    <SidebarMenu>
      {NAV_ITEMS.filter((i) => i.roles.includes(role)).map((item) => (
        <SidebarMenuItem key={item.href} className="px-2">
          <SidebarMenuButton
            asChild
            className="cursor-pointer rounded"
            isActive={pathName === item.href || pathName.startsWith(item.href + "/")}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}

      <SidebarGroup className="py-0">
        {role === Role.CLIENT && (
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroupLabel
              asChild
              className={`group/label cursor-pointer rounded text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full text-sm ${pathName.startsWith("/tasks") && "bg-sidebar-accent text-sidebar-accent-foreground"}`}
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
        )}
      </SidebarGroup>
    </SidebarMenu>
  )
}
