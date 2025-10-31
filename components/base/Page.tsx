import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import React from "react"
import Header from "./Header"

interface PageProps {
  navURL: string
  navURLCount?: string
  children: React.ReactNode
  title: string
  description: string
  rightButton?: React.ReactNode
}

const Page = ({ children, navURL, navURLCount, title, description, rightButton }: PageProps) => {
  return (
    <main className="grid grid-rows-[60px_1fr] w-full h-dvh px-3 pt-4 pb-2 overflow-hidden">
      <Header>
        <Link
          href={`/${navURL.toLowerCase()}`}
          className="flex gap-2 text-primary text-sm items-center justify-center cursor-pointer group bg-gray-50 hover:bg-white size-9 rounded-md border border-border p-2 transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-all duration-300" />
        </Link>
        <div className="flex flex-col flex-1">
          <h2 className="text-base font-bold">{title}</h2>
          <p className="text-muted-foreground text-xs">{description}</p>
        </div>
        {rightButton}
      </Header>
      {children}
    </main>
  )
}

export default Page
