"use client"
// import { SiteHeader } from "@/components/layout/header";
import { Button } from "@/components/ui/button"
// import DynamicHeader from "@/components/ui/dynamic-header";
import { useState } from "react"
import { CreateTicketModal } from "./components/create-ticket-modal"
import { SupportTable } from "./components/support-table"
import Page from "@/components/layouts/Page"

export default function SupportPage() {
  const [createTicket, setCreateTicket] = useState<boolean>(false)
  return (
    <Page navURL="Support" title="Support" description="Create and track your support requests.">
      {/* <SiteHeader>
        <DynamicHeader
          text={
            <p className="text-sm">
              <span className="hover:underline cursor-pointe">
                Tasks Pending
              </span>
              <span className="text-red-500 ml-1">(3)</span>
            </p>
          }
        />
      </SiteHeader> */}
      <div className="py-4">
        {/* Title + CTA */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
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
    </Page>
  )
}
