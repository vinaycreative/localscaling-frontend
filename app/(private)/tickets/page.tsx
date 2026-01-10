import { TicketsTable } from "./components/tickets-table"
import Page from "@/components/base/Page"

export default function SupportPage() {
  return (
    <Page navURL="tickets" title="Tickets" description="Track tickets requests.">
      <div className="overflow-scroll">
        <div className="py-0">
          <TicketsTable />
        </div>
      </div>
    </Page>
  )
}
