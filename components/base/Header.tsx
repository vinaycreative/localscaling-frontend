"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

function Header({ children, className }: { children: ReactNode; className: string }) {
  return (
    <header
      className={cn(
        "flex items-center gap-2 h-full border-b border-border p-0 md:p-2 py-4 sticky top-0 z-10 bg-secondary",
        className
      )}
    >
      {children}
    </header>
  )
}

export default Header
