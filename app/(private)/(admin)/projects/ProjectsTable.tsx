"use client"

import { DataTable } from "@/components/data-table/data-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { Checkbox } from "@/components/ui/checkbox"
import { STATUS } from "@/constants/select-options"
import { useDataTable } from "@/hooks/use-data-table"
import { useProjects } from "@/hooks/useProjects"
import { formatDate } from "@/lib/format"
import { Project } from "@/types/projects"
import { ColumnDef } from "@tanstack/react-table"
import { parseAsInteger, parseAsString, useQueryState } from "nuqs"
import React from "react"

const columns: ColumnDef<Project>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          aria-label="Select all"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          aria-label={`Select ${row.original.id}`}
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Client Id" />,
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground break-all whitespace-break-spaces">
        {getValue<string>()}
      </span>
    ),
    enableSorting: true,
    size: 200,
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Project Name" />,
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground">{getValue<string>()}</span>
    ),
    meta: {
      label: "Project Name",
      variant: "text",
    },
    size: 200,
  },
  {
    id: "stage",
    accessorKey: "stage",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Stage" />,
    enableSorting: true,
    enableColumnFilter: true,

    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground">{getValue<string>()}</span>
    ),
    meta: {
      label: "Stage",
      variant: "select",
      options: [
        { label: "Low", value: "low" },
        { label: "Medium", value: "medium" },
        { label: "High", value: "high" },
      ],
    },
    size: 150,
  },
  {
    accessorKey: "assigned_to",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Assigned To" />,
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }) => (
      <span className={`text-xs text-muted-foreground break-words whitespace-break-spaces`}>
        {getValue<string>()}
      </span>
    ),
    size: 200,
  },
  {
    accessorKey: "due_date",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Due date" />,
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }) => (
      <span className={`text-xs text-muted-foreground break-words whitespace-break-spaces`}>
        {getValue<string>()}
      </span>
    ),
    size: 200,
  },
  {
    id: "status",
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Status" />,
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }) => (
      <span className={`text-xs text-muted-foreground break-words whitespace-break-spaces`}>
        {getValue<string>()}
      </span>
    ),
    size: 100,
    meta: {
      label: "Status",
      variant: "select",
      options: STATUS,
    },
  },
  {
    id: "created_at",
    accessorKey: "created_at",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Created At" />,
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground break-all">
        {formatDate(getValue<string>())}
      </span>
    ),
    enableSorting: true,
    size: 180,
    meta: {
      label: "Created at",
      variant: "date",
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Updated At" />,
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground">{formatDate(getValue<string>())}</span>
    ),
    enableSorting: true,
    size: 180,
  },
]

const ProjectsTable = () => {
  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10))
  const [name] = useQueryState("name", parseAsString.withDefault(""))
  const [stage] = useQueryState("stage", parseAsString.withDefault(""))
  const [assignee] = useQueryState("assignee", parseAsString.withDefault(""))
  const [created_at] = useQueryState("created_at", parseAsString.withDefault(""))
  const [status] = useQueryState("status", parseAsString.withDefault(""))

  const { data, isLoading } = useProjects({
    page,
    perPage,
    name,
    stage: stage?.[0] || "",
    assignee,
    status: status?.[0] || "",
    created_at,
  })

  const { table } = useDataTable({
    data: data?.data || [],
    columns: columns,
    pageCount: data?.totalPages,
    getRowId: (row) => row.id,
    initialState: {
      columnPinning: {
        left: ["select", "id"],
      },
    },
  })

  return (
    <div className="w-full h-full overflow-scroll">
      <div className="overflow-hidden rounded-lg border bg-card w-full">
        <div className="data-table-container p-2 ">
          <DataTable table={table} isLoading={isLoading}>
            <DataTableToolbar table={table}></DataTableToolbar>
          </DataTable>
        </div>
      </div>
    </div>
  )
}

export default ProjectsTable
