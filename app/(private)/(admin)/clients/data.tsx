"use client"
import { useState } from "react"
import { useGetClientLeads } from "@/hooks/useClientLead"
import { DataTable, ColumnDef } from "@/components/reusable/data-table"
import Image from "next/image"
import moment from "moment"
import { ClientLeads } from "@/types/schema/clientLeadSchema"

export const ClinetData = () => {
  const { data, isLoading, error } = useGetClientLeads()
  const [selectedClients, setSelectedClients] = useState<(string | number)[]>([])

  const getPaymentColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-600"
      default:
        return "text-muted-foreground"
    }
  }

  const getOnboardingColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600"
      default:
        return "text-muted-foreground"
    }
  }

  const columns: ColumnDef<ClientLeads["data"][number]>[] = [
    {
      accessorKey: "company_name",
      header: "Company name",
      sortable: true,
      cell: (row) => <span className="font-medium text-foreground">{row.company_name}</span>,
    },
    {
      accessorKey: "name",
      header: "Client name",
      sortable: true,
      cell: (row) => <span className="font-medium text-foreground">{row.name}</span>,
    },
    {
      accessorKey: "monthly_payment_excluding_taxes",
      header: "Payment",
      sortable: true,
      cell: (row) => (
        <span
          className={`text-muted-foreground ${getPaymentColor(row.monthly_payment_excluding_taxes)}`}
        >
          {row.monthly_payment_excluding_taxes}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Onboarding",
      sortable: true,
      cell: (row) => (
        <span className="text-muted-foreground">
          {row.status === "pending" ? "Started" : "Completed"}
        </span>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Last update",
      sortable: true,
      cell: (row) => (
        <span className="text-muted-foreground">
          {row.created_at ? moment(row.created_at).format("lll") : "-"}
        </span>
      ),
    },
  ]

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 py-4 flex-1 h-full items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 py-4 flex-1 h-full items-center justify-center">
        <p className="text-destructive">Error loading client leads</p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col gap-4 py-4 flex-1 h-full items-center justify-center">
        <p className="text-muted-foreground">No client leads found</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 py-4 flex-1 h-full">
      <DataTable
        data={data}
        columns={columns}
        enableSelection={true}
        onSelectionChange={(selectedIds) => setSelectedClients(selectedIds)}
        getRowId={(row) => (row.id || `client-${row.name}-${row.company_name}`) as string | number}
      />
    </div>
  )
}
