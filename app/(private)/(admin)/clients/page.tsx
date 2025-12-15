import Page from "@/components/base/Page"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ClinetData } from "./data"

function ClientsPage() {
  return (
    <Page
      navURL="Dashboard"
      title="Clients"
      description="Add a new client, record payment, and send onboarding access."
      rightButton={
        <Button asChild className="cursor-pointer rounded">
          <Link href="clients/add">Add new client</Link>
        </Button>
      }
    >
      <ClinetData />
    </Page>
  )
}

export default ClientsPage
