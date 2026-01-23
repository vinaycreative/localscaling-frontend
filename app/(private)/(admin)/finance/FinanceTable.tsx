"use client"
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
import { parseAsInteger, parseAsString, useQueryState } from "nuqs"
import { STATUS } from "@/constants/select-options"

type Client = z.infer<typeof getClientsSchema>

// name: "GartenPro Service",
// revenue: "€2,400",
// adSpend: "€1,100",
// profitMargin: "54%",
// status: "Renewal",

const columns: ColumnDef<Client>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Name" />,
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: "Name",
      variant: "text",
    },
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "revenue",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Revenue" />,
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "ad_spend",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Ad Spent" />,
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "profit_margin",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Profit Margin" />,
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Status" />,
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground">{getValue<string>()}</span>
    ),
    meta: {
      label: "Status",
      variant: "select",
      options: STATUS,
    },
  },

  {
    accessorKey: "created_at",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Created At" />,
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground">{formatDate(getValue<string>())}</span>
    ),
    meta: {
      label: "Created At",
      variant: "date",
    },
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Updated At" />,
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground">{formatDate(getValue<string>())}</span>
    ),
  },
]

function FinanceTable() {
  const { user } = useLoggedInUser()
  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10))
  const [company_name] = useQueryState("company_name", parseAsString.withDefault(""))
  const { data, isLoading } = useGetClientLeads(user?.type as "internal" | "client", {
    page,
    perPage,
    company_name,
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
    {
      label: "Total revenue (This month)",
      value: activeProjects.toString(),
    },
    {
      label: "Total ad spend",
      value: pendingClientActions.toString(),
    },
    { label: "Active clients", value: pendingTasks.toString() },
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
            <h2 className="text-xl font-semibold text-foreground">Financial Overview</h2>
            <p className="text-muted-foreground text-xs">
              Financial Overview progress, client assets, and setup status.
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
  )
}

export default FinanceTable
