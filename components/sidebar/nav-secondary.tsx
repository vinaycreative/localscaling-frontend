import { type LucideIcon } from "lucide-react";
import * as React from "react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RoleValue } from "@/constants/auth";

export function NavSecondary({
  role,
  items,
  isLoading,
}: {
  isLoading: boolean,
  role?: RoleValue | null,
  items: {
    label: string
    href: string
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    roles: readonly string[]
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathName = usePathname()
  return (
    <SidebarMenu>
      {isLoading ?
        <div className="flex flex-col gap-2">
          {[1, 2]?.map((skel) => <SidebarMenuSkeleton className="border border-gray-100 m-1 p-4 justify-between" key={skel} />)}
        </div>
        : items.filter((item) => item.roles.includes(role as string)).map((item) => (
          <SidebarMenuItem key={item.label}>
            <SidebarMenuButton asChild className={`text-muted-foreground rounded ${pathName.startsWith("/support") && "bg-sidebar-accent text-sidebar-accent-foreground"}`}>
              <Link href={item.href}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
    </SidebarMenu>
  );
}
