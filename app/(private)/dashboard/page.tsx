"use client"

import Page from "@/components/base/Page"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable, ColumnDef } from "@/components/reusable/data-table"
import { useGetClientLeads } from "@/hooks/useClientLead"
import { MoreVertical } from "lucide-react"
import { useState } from "react"
import moment from "moment"
import { ClientLeads } from "@/types/schema/clientLeadSchema"

function Dashboard() {
  const { data, isLoading, error } = useGetClientLeads()
  const [selectedProjects, setSelectedProjects] = useState<(string | number)[]>([])

  const activeProjects = data?.filter((client) => client.status === "completed").length || 0
  const pendingClientActions = data?.filter((client) => client.status === "pending").length || 0
  const pendingTasks = data?.filter((client) => client.status === "delayed").length || 0

  const metrics = [
    { label: "Active projects", value: activeProjects.toString() },
    { label: "Pending client actions", value: pendingClientActions.toString() },
    { label: "Pending tasks", value: pendingTasks.toString() },
  ]

  const getStatusColor = (state: string) => {
    switch (state?.toLowerCase()) {
      case "completed":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "delayed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const columns: ColumnDef<ClientLeads["data"][number]>[] = [
    {
      accessorKey: "name",
      header: "Owner",
      sortable: true,
      cell: (row) => <span className="text-muted-foreground">{row.name}</span>,
    },
    {
      accessorKey: "company_name",
      header: "Company name",
      sortable: true,
      cell: (row) => <span className="font-medium text-foreground">{row.company_name}</span>,
    },
    {
      accessorKey: "monthly_payment_excluding_taxes",
      header: "Payment",
      sortable: true,
      cell: (row) => (
        <span className="text-muted-foreground">{row.monthly_payment_excluding_taxes}</span>
      ),
    },
    {
      accessorKey: "payment_status",
      header: "Payment Status",
      sortable: true,
      cell: (row) => (
        <span className="text-muted-foreground capitalize">{row.payment_status}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
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

  return (
    <Page
      navURL="Dashboard"
      title="Dashboard"
      description="Overview of recent active projects, their progress, key metrics, and
          overall performance status."
    >
      <div className="flex-1 flex flex-col gap-4 overflow-hidden py-4">
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

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-destructive">Error loading client leads</p>
          </div>
        ) : !data || data.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">No client leads found</p>
          </div>
        ) : (
          <DataTable
            data={data}
            columns={columns}
            enableSelection={true}
            onSelectionChange={(selectedIds) => setSelectedProjects(selectedIds)}
            getRowId={(row) => {
              const id = row.id || `client-${row.name}-${row.company_name}`
              return id as string | number
            }}
          />
        )}
      </div>
    </Page>
  )
}

export default Dashboard
