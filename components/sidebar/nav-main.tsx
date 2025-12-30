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
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Badge } from "../ui/badge"
import { useLoggedInUser } from "@/hooks/useAuth"
import type { RoleValue } from "@/constants/auth"
import { Role } from "@/constants/auth"
import { useSidebarInfo } from "@/hooks/useSidebarInfo"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const default_items = [
  {
    name: "Business Information",
    count: 17,
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
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  roles: readonly string[]
}


const NAV_ITEMS: readonly NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: [Role.client, Role.support_head_admin, Role.support_admin, Role.admin],
  },
  {
    label: "Tickets",
    href: "/tickets",
    icon: Ticket,
    roles: [Role.support_head_admin, Role.support_admin],
  },
  { label: "Projects", href: "/projects", icon: Server, roles: [Role.admin] },
  { label: "Clients", href: "/clients", icon: Users, roles: [Role.admin] },
  { label: "Tools", href: "/tools", icon: ToggleRight, roles: [Role.admin] },
  { label: "Finance", href: "/finance", icon: ChartPie, roles: [Role.admin] },
]

type itemType = {
  name: string
  count: number
  href: string
}

export function NavMain({ initialRole }: { initialRole?: RoleValue }) {
  const pathName = usePathname()
  const { user } = useLoggedInUser()
  const [items, setItems] = useState<itemType[]>([...default_items])
  const { data: sidebarInfo, isLoading: countLoading, error: countError } = useSidebarInfo()
  const role = user?.role

  useEffect(() => {
    if (sidebarInfo && !countLoading && !countError) {
      setItems((prev) => {
        const filteredData = prev?.map((el) => {
          const key = el?.href.split("/tasks/").join("")
          return { ...el, count: +sidebarInfo?.[key] }
        })
        return filteredData
      })
    } else {
      if (!items) setItems([...default_items])
    }
  }, [sidebarInfo, countLoading, countError])

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
        {role === Role.client && (
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
                  {items.map((item: itemType) => (
                    <SidebarMenuItem key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex justify-between px-2 py-1 rounded hover:text-foreground hover:bg-muted transition-all duration-300 ${pathName.includes(item.href) ? "bg-muted text-foreground" : "text-muted-foreground"}`}
                      >
                        {item.name}
                        {item.count > 0 && (
                          <Badge
                            variant={"outline"}
                            className={cn(
                              "border-0 text-destructive/60 bg-destructive/10 rounded-lg",
                              countLoading && "px-1"
                            )}
                          >
                            {countLoading ? <Loader2 className="animate-spin" /> : item.count}
                          </Badge>
                        )}
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
