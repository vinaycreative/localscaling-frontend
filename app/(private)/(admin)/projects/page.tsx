"use client"

import Page from "@/components/base/Page"
import { DataTable, ColumnDef } from "@/components/reusable/data-table"
import { MoreVertical } from "lucide-react"
import { useState } from "react"

interface Project {
  id: number
  name: string
  stage: string
  assignee: string
  dueDate: string
  status: "On time" | "Delayed" | "Pending"
  statusColor: string
}

function ProjectsPage() {
  const [selectedProjects, setSelectedProjects] = useState<number[]>([])

  const projectsData: Project[] = [
    {
      id: 1,
      name: "ElektroPius Berlin",
      stage: "Branding",
      assignee: "John doe",
      dueDate: "Sep 1, 2025",
      status: "On time",
      statusColor: "bg-green-500",
    },
    {
      id: 2,
      name: "GartenPro Service",
      stage: "Google ads",
      assignee: "John doe",
      dueDate: "Sep 1, 2025",
      status: "Delayed",
      statusColor: "bg-red-500",
    },
    {
      id: 3,
      name: "Solarhaus Solutions",
      stage: "Website setup",
      assignee: "John doe",
      dueDate: "Sep 1, 2025",
      status: "Pending",
      statusColor: "bg-amber-500",
    },
    {
      id: 4,
      name: "Kitchendesign Nord",
      stage: "Branding",
      assignee: "John doe",
      dueDate: "Sep 1, 2025",
      status: "On time",
      statusColor: "bg-green-500",
    },
    {
      id: 5,
      name: "FensterFix24",
      stage: "Google ads",
      assignee: "John doe",
      dueDate: "Sep 1, 2025",
      status: "Delayed",
      statusColor: "bg-red-500",
    },
    {
      id: 6,
      name: "OceanCity Bins",
      stage: "Website setup",
      assignee: "John doe",
      dueDate: "Sep 1, 2025",
      status: "Pending",
      statusColor: "bg-amber-500",
    },
    {
      id: 11,
      name: "ElektroPius Berlin",
      stage: "Branding",
      assignee: "John doe",
      dueDate: "Sep 1, 2025",
      status: "On time",
      statusColor: "bg-green-500",
    },
    {
      id: 21,
      name: "GartenPro Service",
      stage: "Google ads",
      assignee: "John doe",
      dueDate: "Sep 1, 2025",
      status: "Delayed",
      statusColor: "bg-red-500",
    },
    {
      id: 13,
      name: "Solarhaus Solutions",
      stage: "Website setup",
      assignee: "John doe",
      dueDate: "Sep 1, 2025",
      status: "Pending",
      statusColor: "bg-amber-500",
    },
    {
      id: 14,
      name: "Kitchendesign Nord",
      stage: "Branding",
      assignee: "John doe",
      dueDate: "Sep 1, 2025",
      status: "On time",
      statusColor: "bg-green-500",
    },
    {
      id: 15,
      name: "FensterFix24",
      stage: "Google ads",
      assignee: "John doe",
      dueDate: "Sep 1, 2025",
      status: "Delayed",
      statusColor: "bg-red-500",
    },
    {
      id: 26,
      name: "OceanCity Bins",
      stage: "Website setup",
      assignee: "John doe",
      dueDate: "Sep 1, 2025",
      status: "Pending",
      statusColor: "bg-amber-500",
    },
  ]

  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "name",
      header: "Client/Project name",
      sortable: true,
      cell: (row) => <span className="font-medium text-foreground">{row.name}</span>,
    },
    {
      accessorKey: "stage",
      header: "Stage",
      sortable: true,
      cell: (row) => <span className="text-muted-foreground">{row.stage}</span>,
    },
    {
      accessorKey: "assignee",
      header: "Assignee",
      sortable: true,
      cell: (row) => <span className="text-muted-foreground">{row.assignee}</span>,
    },
    {
      accessorKey: "dueDate",
      header: "Due date",
      sortable: true,
      cell: (row) => <span className="text-muted-foreground">{row.dueDate}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${row.statusColor}`}></div>
          <span className="text-muted-foreground">{row.status}</span>
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: "",
      sortable: false,
      width: "48px",
      cell: () => (
        <button className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          <MoreVertical className="w-5 h-5" />
        </button>
      ),
    },
  ]

  return (
    <Page
      navURL="Dashboard"
      title="Projects"
      description="Overview of project progress, client assets, and setup status."
    >
      <div className="flex flex-col h-full overflow-hidden py-4 min-h-0">
        <DataTable
          data={projectsData}
          columns={columns}
          enableSelection={true}
          onSelectionChange={(selectedIds) => setSelectedProjects(selectedIds as number[])}
          getRowId={(row) => row.id}
        />
      </div>
    </Page>
  )
}

export default ProjectsPage
