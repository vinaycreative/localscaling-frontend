"use client"
import { SupportTable } from "./components/support-table"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function SupportPage() {
  return (
    <main className="flex flex-col gap-4 min-h-screen space-y-8">
      <div className="px-4 py-4 lg:px-0">
        {/* Top breadcrumb-ish row */}
        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />
          <span className="hover:underline cursor-pointer">Tasks pending</span>
          <span className="text-red-500">(3)</span>
        </div>

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
