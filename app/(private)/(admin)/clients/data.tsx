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
import { Checkbox } from "@/components/ui/checkbox"
import { Badge, badgeClassNames, BadgeTypes } from "@/components/ui/badge"

type Lead = ClientLeads["data"][number]

const columns: ColumnDef<Lead>[] = [
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
  // {
  //   accessorKey: "id",
  //   header: ({ column }) => <DataTableColumnHeader column={column} label="Client Id" />,
  //   cell: ({ row }) => {
  //     const t = row.original
  //     return (
  //       <div className="flex items-center gap-2">
  //         <Link href="#" className="truncate hover:underline w-full">
  //           {t.id}
  //         </Link>
  //       </div>
  //     )
  //   },
  //   enableSorting: true,
  //   size: 300,
  // },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Client Name" />,
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.name}</span>,
    size: 200,
  },
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
          className="font-medium text-muted-foreground hover:underline"
        >
          {row.original.company_name}
        </Link>

        <Link
          href={`/clients/${row.original.id}/profile`}
          className="text-muted-foreground font-medium hover:underline flex items-center justify-center"
        >
          <ExternalLink className="text-blue-600 inline-block h-4" />
        </Link>
      </p>
    ),
    size: 200,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Email" />,
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }) => (
      <span className={`text-xs text-muted-foreground break-words whitespace-break-spaces`}>{getValue<string>()}</span>
    ),
    size: 200,
  },
  {
    accessorKey: "vat_id",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Vat Id" />,
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }) => (
      <span className={`text-xs text-muted-foreground break-words whitespace-break-spaces`}>{getValue<string>()}</span>
    ),
    size: 200,
  },
  {
    accessorKey: "address",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Address" />,
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }) => (
      <span className={`text-xs text-muted-foreground break-words whitespace-break-spaces`}>{getValue<string>()}</span>
    ),
    size: 200,
  },
  {
    accessorKey: "state",
    header: ({ column }) => <DataTableColumnHeader column={column} label="State" />,
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }) => (
      <span className={`text-xs text-muted-foreground break-words`}>{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "city",
    header: ({ column }) => <DataTableColumnHeader column={column} label="City" />,
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }) => (
      <span className={`text-xs text-muted-foreground`}>{getValue<string>()}</span>
    ),
    size: 100,
  },
  {
    accessorKey: "postal_code",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Postal Code" />,
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }) => (
      <span className={`text-xs text-muted-foreground`}>{getValue<string>()}</span>
    ),
    size: 100,
  },
  {
    accessorKey: "country",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Country" />,
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }) => (
      <span className={`text-xs text-muted-foreground`}>{getValue<string>()}</span>
    ),
    size: 100,
  },
  {
    accessorKey: "payment_status",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Payment Status" />,
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }) => (
      <span className={`text-xs text-muted-foreground`}>{getValue<string>()}</span>
    ),
    size: 150,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Status" />,
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }) => (
      <Badge className={badgeClassNames(getValue<string>() as BadgeTypes)}>
        {getValue<string>()}
      </Badge>
    ),
    size: 100,
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
