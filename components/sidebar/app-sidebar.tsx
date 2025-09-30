"use client"
import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { LifeBuoy, Send } from "lucide-react"
import Image from "next/image"
import * as React from "react"
import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props} variant="floating" className="bg-muted">
      <SidebarHeader className="border-sidebar-border h-16 bg-background rounded-t-md">
        <div className="flex h-full w-full items-center justify-start px-2">
          <Image width={100} height={50} src="/logo.svg" alt="Logo" className="w-40" />
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-background">
        <NavMain />
      </SidebarContent>
      <SidebarFooter className="bg-background rounded-b-md">
        <NavSecondary items={data.navSecondary} className="mt-auto" />
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
