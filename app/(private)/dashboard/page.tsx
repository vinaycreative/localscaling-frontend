"use client"

import Page from "@/components/base/Page"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetClientLeads } from "@/hooks/useClientLead"
import { MoreVertical } from "lucide-react"
import { useState } from "react"
import { ClientLeads, getClientsSchema } from "@/types/schema/clientLeadSchema"
import { useAuthStore } from "@/store/authStore"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import z from "zod"

type Client = z.infer<typeof getClientsSchema>

const columns: ColumnDef<ClientLeads["data"][number]>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Ticket Id" />,
    cell: ({ getValue }) => {
      return (
        <span className="text-xs text-foreground/90 break-words whitespace-break-spaces">
          {getValue<string>()}
        </span>
      )
    },
    enableSorting: true,
    size: 300,
  },
  {
    accessorKey: "company_name",
    header: "Company name",
    enableSorting: true,
    cell: ({ getValue }) => {
      return (
        <span className="text-xs text-foreground/90 break-words whitespace-break-spaces">
          {getValue<string>()}
        </span>
      )
    },
  },
  {
    accessorKey: "monthly_payment_excluding_taxes",
    header: "Payment",
    enableSorting: true,
    cell: ({ getValue }) => {
      return (
        <span className="text-xs text-foreground/90 break-words whitespace-break-spaces">
          {getValue<string>()}
        </span>
      )
    },
  },
  {
    accessorKey: "payment_status",
    header: "Payment Status",
    enableSorting: true,
    cell: ({ getValue }) => {
      return (
        <span className="text-xs text-foreground/90 break-words whitespace-break-spaces">
          {getValue<string>()}
        </span>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
    cell: ({ getValue }) => {
      return (
        <span className="text-xs text-foreground/90 break-words whitespace-break-spaces">
          {getValue<string>()}
        </span>
      )
    },
  },

  {
    accessorKey: "created_at",
    header: "Last update",
    enableSorting: true,
    cell: ({ getValue }) => {
      return (
        <span className="text-xs text-foreground/90 break-words whitespace-break-spaces">
          {getValue<string>()}
        </span>
      )
    },
  },
]

function Dashboard() {
  const { user } = useAuthStore()
  const { data, isLoading } = useGetClientLeads(user?.type as "internal" | "client")
  const clients = data?.data ?? []
  const { activeProjects, pendingClientActions, pendingTasks } = clients.reduce(
    (
      acc: { activeProjects: number; pendingClientActions: number; pendingTasks: number },
      client: Client
    ) => {
      if (client.status === "active") acc.activeProjects++
      if (client.status === "pending") acc.pendingClientActions++
      if (client.status === "delayed") acc.pendingTasks++
      return acc
    },
    {
      activeProjects: 0,
      pendingClientActions: 0,
      pendingTasks: 0,
    }
  )

  const metrics = [
    { label: "Active projects", value: activeProjects.toString() },
    { label: "Pending client actions", value: pendingClientActions.toString() },
    { label: "Pending tasks", value: pendingTasks.toString() },
  ]

  const { table } = useDataTable({
    data: clients,
    columns: columns,
    pageCount: 1,
    getRowId: (row) => row.id,
    initialState: {
      columnPinning: {
        left: ["select", "id"],
        right: ["actions"],
      },
    },
  })

  return (
    <Page
      navURL="Dashboard"
      title="Dashboard"
      description="Overview of recent active projects, their progress, key metrics, and
          overall performance status."
    >
      <div className="overflow-scroll">
        <div className="flex-1 flex flex-col gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {metrics.map((metric, index) => (
              <Card key={index} className="bg-card border rounded-md gap-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.label}
                  </CardTitle>
                  <button className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{metric.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Recent project details</h2>
              <p className="text-muted-foreground text-xs">
                Overview of project progress, client assets, and setup status.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={"outline"}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                View all
              </Button>
              <button className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
          <DataTable table={table} isLoading={isLoading}>
            <DataTableToolbar table={table}></DataTableToolbar>
          </DataTable>
        </div>
      </div>
    </Page>
  )
}

export default Dashboard
