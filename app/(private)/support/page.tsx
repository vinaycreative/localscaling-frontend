"use client"
import { SiteHeader } from "@/components/layout/site-header"
import { SupportTable } from "./components/support-table"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import DynamicHeader from "@/components/ui/dynamic-header"

export default function SupportPage() {
  return (
    <main className="flex flex-col gap-4 min-h-screen">
      <SiteHeader>
        <DynamicHeader
          text={
            <p>
              <span className="hover:underline cursor-pointer">Tasks Pending</span>
              <span className="text-red-500 ml-1">(3)</span>
            </p>
          }
        />
      </SiteHeader>
      <div>
        {/* Title + CTA */}
        <div className="mb-2 flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-balance text-3xl font-bold">Support</h2>
            <p className="text-pretty text-muted-foreground">
              Create and track your support requests.
            </p>
          </div>

          <Button>Create a new ticket</Button>
        </div>

        <div className="pt-4">
          <SupportTable />
        </div>
      </div>
    </main>
  )
}
