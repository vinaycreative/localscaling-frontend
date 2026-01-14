import * as React from "react"
import Image from "next/image"
import { MessageCircle, type LucideIcon } from "lucide-react"

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar"
import { NavUser } from "@/components/sidebar/nav-user"
import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { useLoggedInUser } from "@/hooks/useAuth"

type NavSecondaryType = {
  title: string
  url: string
  icon: LucideIcon
}

const data = {
  user: {
    name: "User Name",
    email: "user@email.com",
  },

  navSecondary: [
    {
      title: "Support",
      url: "/support",
      icon: MessageCircle,
    },
  ],
}

export default function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { user } = useLoggedInUser()

  const navSecondaryItems: NavSecondaryType[] = data?.navSecondary

  return (
    <Sidebar {...props} variant="floating" className="bg-muted shadow-none">
      <SidebarHeader className="h-16 bg-background rounded-t-md">
        <div className="flex h-full w-full items-center justify-start px-2">
          <Image src="./assets/logo.svg" alt="Logo" width={100} height={50} className="w-40" />
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-background">
        <NavMain initialRole={user?.role} />
      </SidebarContent>
      <SidebarFooter className="bg-background rounded-b-md">
        <NavSecondary items={navSecondaryItems} className="mt-auto" />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
