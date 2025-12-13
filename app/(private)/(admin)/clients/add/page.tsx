import type React from "react"
import Page from "@/components/base/Page"
import { ClientLeadForm } from "@/form/client-lead"

function AddClientPage() {
  return (
    <Page
      navURL="clients"
      title="Add New Client"
      description="Enter client details and billing information"
    >
      <ClientLeadForm />
    </Page>
  )
}

export default AddClientPage
