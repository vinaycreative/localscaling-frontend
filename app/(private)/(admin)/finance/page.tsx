import Page from "@/components/base/Page"
import FinanceTable from "./FinanceTable"

function FinancePage() {
  return (
    <Page
      navURL="Dashboard"
      title="Finance"
      description="Overview of key financial metrics, revenue performance, and client
          billing status."
    >
      <FinanceTable />
    </Page>
  )
}

export default FinancePage
