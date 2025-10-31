"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import React from "react"
import Header from "./Header"
import { cn } from "@/lib/utils" // if you use shadcn utils, else remove and use join

interface PageProps {
  /** Back navigation link (e.g., "dashboard" → /dashboard) */
  navURL?: string
  /** Optional number/text displayed next to navURL */
  navURLCount?: string
  /** Main content */
  children: React.ReactNode
  /** Header title */
  title: string
  /** Header description/subtitle */
  description?: string
  /** Right-aligned button or element in header */
  rightButton?: React.ReactNode
  /** Custom class for main wrapper */
  className?: string
  /** Custom class for Header */
  headerClassName?: string
  /** Custom class for content area */
  contentClassName?: string
  /** Whether to show back button */
  showBackButton?: boolean
  /** Optional manual back handler instead of using navURL */
  onBack?: () => void
}

const Page = ({
  children,
  navURL,
  navURLCount,
  title,
  description,
  rightButton,
  className,
  headerClassName,
  contentClassName,
  showBackButton = true,
  onBack,
}: PageProps) => {
  
  return (
    <main
      className={cn(
        "grid grid-rows-[64px_1fr] w-full h-dvh px-3 pt-0 pb-2 flex-1",
        className
      )}
    >
      <Header className={cn("flex items-center gap-3", headerClassName)}>
        {showBackButton && (
          <>
            {onBack ? (
              <button
                onClick={onBack}
                className="flex gap-2 text-primary text-sm items-center justify-center cursor-pointer group bg-white size-10 rounded-md border border-border p-2"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-all duration-300" />
              </button>
            ) : (
              navURL && (
                <Link
                  href={`/${navURL.toLowerCase()}`}
                  className="flex gap-2 text-primary text-sm items-center justify-center cursor-pointer group bg-white size-8 md:size-10 rounded-md border border-border p-2"
                >
                  <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-all duration-300" />
                </Link>
              )
            )}
          </>
        )}

        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg md:text-xl font-bold">{title}</h2>
            {navURLCount && (
              <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                {navURLCount}
              </span>
            )}
          </div>
          {description && (
            <p className="text-muted-foreground text-[12px] md:text-xs">{description}</p>
          )}
        </div>

        {rightButton && <div className="ml-auto">{rightButton}</div>}
      </Header>

      <section
        className={cn("w-full h-full", contentClassName)}
      >
        {children}
      </section>
    </main>
  )
}

export default Page
