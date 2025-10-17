"use client"

import { ArrowLeft } from "lucide-react"
import React from "react"
import { usePathname } from "next/navigation"

const DynamicHeader = () => {
  const pathname = usePathname()

  // Convert pathname into something readable, e.g. "/dashboard/settings" → "Dashboard / Settings"
  const formattedPath =
    pathname
      .split("/")
      .filter(Boolean)
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(" / ") || "Home"

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 text-primary items-center cursor-pointer group">
        <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-all duration-300" />
        {formattedPath}
      </div>
    </div>
  )
}

export default DynamicHeader
