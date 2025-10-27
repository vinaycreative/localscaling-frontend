"use client"

import { ReactNode } from "react"
import { SidebarTrigger } from "../ui/sidebar"

function Header({ children }: { children: ReactNode }) {
  return (
    <header className="flex items-center gap-2 h-full border-b border-border pb-4">
      <SidebarTrigger className="cursor-pointer md:hidden" />
      {children}
    </header>
  )
}

export default Header
