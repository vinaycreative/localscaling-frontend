"use client"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { CreateTicketModal } from "./components/create-ticket-modal"
import { SupportTable } from "./components/support-table"
import Page from "@/components/base/Page"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createTicketSchema } from "@/schema/support"
import { CreateTicketValues } from "@/types/support"

export default function SupportPage() {
  const [createTicket, setCreateTicket] = useState<boolean>(false)
  const form = useForm<CreateTicketValues>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "website",
      priority: "low",
    },
  })

  return (
    <Page
      rightButton={
        <Button
          onClick={() => {
            setCreateTicket((prev) => !prev)
          }}
          className="text-xs md:text-sm"
        >
          Create a new ticket
        </Button>
      }
      navURL="Support"
      title="Support"
      description="Create and track your support requests."
    >
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
      <div className="overflow-scroll">
        <div className="py-4">
          <SupportTable />
        </div>
      </div>
      <CreateTicketModal
        form={form}
        open={createTicket}
        onOpenChange={setCreateTicket}
        onSubmit={(values) => {
          console.log("🚀 ~ SupportPage ~ values:", values)
        }}
      />
    </Page>
  )
}
