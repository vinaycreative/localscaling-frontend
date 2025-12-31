"use client"
import { useGetClientLeads } from "@/hooks/useClientLead"
import { ClientLeads } from "@/types/schema/clientLeadSchema"
import Link from "next/link"
import { useLoggedInUser } from "@/hooks/useAuth"
import { ExternalLink } from "lucide-react"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { ColumnDef } from "@tanstack/react-table"
import { useDataTable } from "@/hooks/use-data-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { formatDate } from "@/lib/format"
import { parseAsInteger, parseAsString, useQueryState } from "nuqs"

type Lead = ClientLeads["data"][number]

const columns: ColumnDef<Lead>[] = [
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

export const ClinetData = () => {
  const { user } = useLoggedInUser()

  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10))
  const [company_name] = useQueryState("company_name", parseAsString.withDefault(""))
  const { data, isLoading } = useGetClientLeads(user?.type as "internal" | "client", {
    page,
    perPage,
    company_name,
  })

  const { table } = useDataTable({
    data: data?.data || [],
    columns: columns,
    pageCount: data?.totalPages,
    getRowId: (row) => row.id,
    initialState: {
      columnPinning: {
        left: ["company_name"],
      },
    },
  })

  return (
    <div className="w-full h-full overflow-scroll">
      {JSON.stringify(isLoading)}
      <div className="overflow-hidden rounded-lg border bg-card w-full">
        <div className="data-table-container p-2">
          <DataTable table={table} isLoading={isLoading}>
            <DataTableToolbar table={table}></DataTableToolbar>
          </DataTable>
        </div>
      </div>
    </div>
  )
}
