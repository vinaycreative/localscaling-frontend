"use client"
import { useState } from "react"
import { SiteHeader } from "@/components/layout/site-header"
import { SupportTable } from "./components/support-table"
import { Button } from "@/components/ui/button"
import DynamicHeader from "@/components/ui/dynamic-header"
import { CreateTicketModal } from "./components/create-ticket-modal"

export default function SupportPage() {
  const [createTicket, setCreateTicket] = useState<boolean>(false)
  return (
    <main className="flex flex-col gap-4 min-h-screen">
      <SiteHeader>
        <DynamicHeader
          text={
            <p className="text-sm">
              <span className="hover:underline cursor-pointe">Tasks Pending</span>
              <span className="text-red-500 ml-1">(3)</span>
            </p>
          }
        />
      </SiteHeader>
      <div>
        {/* Title + CTA */}
        <div className="mb-2 flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-balance text-3xl font-bold">Support</h2>
            <p className="text-pretty text-muted-foreground">
              Create and track your support requests.
            </p>
          </div>

          <Button
            onClick={() => {
              setCreateTicket((prev) => !prev)
            }}
          >
            Create a new ticket
          </Button>
        </div>

        <div className="py-4">
          <SupportTable />
        </div>
      </div>
      <CreateTicketModal
        open={createTicket}
        onOpenChange={setCreateTicket}
        onSubmit={(values) => {
          console.log("🚀 ~ SupportPage ~ values:", values)
        }}
      />
    </main>
  )
}
