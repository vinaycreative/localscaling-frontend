"use client"

import Page from "@/components/base/Page"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetClientLeads } from "@/hooks/useClientLead"
import { ExternalLink, MoreVertical } from "lucide-react"
import { getClientsSchema } from "@/types/schema/clientLeadSchema"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import z from "zod"
import { useLoggedInUser } from "@/hooks/useAuth"
import { formatDate } from "@/lib/format"

type Client = z.infer<typeof getClientsSchema>

const columns: ColumnDef<Client>[] = [
  {
    id: "company_name",
    accessorKey: "company_name",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Company Name" />,
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: "Company Name",
      variant: "text",
    },
    cell: ({ row }) => (
      <p className="flex items-center gap-2">
        <Link
          href={`/clients/payment?success=${row.original.id}`}
          className="font-medium text-foreground hover:underline"
        >
          {row.original.company_name}
        </Link>

        <Link
          href={`/clients/${row.original.id}/profile`}
          className="font-medium hover:underline flex items-center justify-center"
        >
          <ExternalLink className="text-blue-600 inline-block h-4" />
        </Link>
      </p>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Client Name" />,
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.name}</span>,
  },
  {
    accessorKey: "monthly_payment_excluding_taxes",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Monthly Payment" />,
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ row }) => (
      <span className={`text-xs text-muted-foreground`}>
        {row.original.monthly_payment_excluding_taxes}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Status" />,
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {row.original.status === "pending" ? "Started" : "Completed"}
      </span>
    ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Created At" />,
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">{formatDate(row.original.created_at)}</span>
    ),
  },
]

function Dashboard() {
  const { user } = useLoggedInUser()
  const { data, isLoading } = useGetClientLeads(user?.type as "internal" | "client", {
    page: 1,
    perPage: 10,
  })

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
    pageCount: data?.totalPages,
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
          </div>
          <div className="overflow-hidden rounded-lg border bg-card w-full">
            <div className="data-table-container p-2">
              <DataTable table={table} isLoading={isLoading}>
                <DataTableToolbar table={table}></DataTableToolbar>
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
}

export default Dashboard
