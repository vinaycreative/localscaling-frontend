"use client"
import { Checkbox } from "@/components/ui/checkbox"
import { PriorityBadge, StatusBadge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Paperclip,
  Layers2,
  MessagesSquare,
  CheckCircle,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { TicketDetailsModal } from "./view-details"
import { useState } from "react"
import { AssignedTo, CreatedBy, CreateTicketPayload, Ticket } from "@/types/support"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryState } from "nuqs"
import { useDataTable } from "@/hooks/use-data-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useCreateTicket, useGetTickets } from "@/hooks/useTickets"
import { TICKET_CATEGORIES, TICKET_PRIORITIES } from "./create-ticket-modal"
import { formatDate } from "@/lib/format"

export const getColumns = ({
  setOpenTicket,
  setCurrentDetails,
}: {
  setOpenTicket: React.Dispatch<React.SetStateAction<boolean>>
  setCurrentDetails: React.Dispatch<React.SetStateAction<Ticket | null>>
}): ColumnDef<Ticket>[] => [
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
    header: ({ column }) => <DataTableColumnHeader column={column} label="Ticket Id" />,
    cell: ({ row }) => {
      const t = row.original
      return (
        <div className="flex items-center gap-2">
          {(t?.attachments || [])?.length > 0 && (
            <Paperclip className="h-4 w-4 text-muted-foreground shrink-0" />
          )}
          <Link href="#" className="truncate hover:underline w-full">
            {t.id}
          </Link>
        </div>
      )
    },
    enableSorting: true,
    size: 300,
  },
  {
    id: "title",
    accessorKey: "title",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Title" />,
    cell: ({ getValue }) => (
      <span className="text-xs text-foreground/90 break-words whitespace-break-spaces">
        {getValue<string>()}
      </span>
    ),
    meta: {
      label: "Title",
      variant: "text",
    },
    enableSorting: true,
    enableColumnFilter: true,
    size: 250,
  },
  // {
  //   id: "subject",
  //   accessorKey: "subject",
  //   header: ({ column }) => <DataTableColumnHeader column={column} label="Subject" />,
  //   cell: ({ getValue }) => (
  //     <span className="text-xs text-foreground/90 break-words whitespace-break-spaces">
  //       {getValue<string>()}
  //     </span>
  //   ),
  //   // meta: {
  //   //   label: "Subject",
  //   //   variant: "text",
  //   // },
  //   enableSorting: true,
  //   enableColumnFilter: true,
  //   size: 250,
  // },
  {
    id: "category",
    accessorKey: "category",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Category" />,
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground">{getValue<string>()}</span>
    ),
    enableSorting: true,
    size: 140,
    meta: {
      label: "Category",
      variant: "multiSelect",
      options: TICKET_CATEGORIES,
    },
    enableColumnFilter: true,
  },
  {
    id: "priority",
    accessorKey: "priority",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Priority" />,
    cell: ({ getValue }) => (
      <PriorityBadge priority={getValue<string>() as "high" | "medium" | "low"} />
    ),
    enableSorting: true,
    size: 110,
    meta: {
      label: "Priority",
      variant: "select",
      options: TICKET_PRIORITIES,
    },
    enableColumnFilter: true,
  },
  {
    id: "status",
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Status" />,
    cell: ({ getValue }) => <StatusBadge status={getValue<"open" | "resolved">()} />,
    enableSorting: true,
    size: 120,
    meta: {
      label: "Status",
      variant: "select",
      options: [
        { label: "Open", value: "open", icon: CheckCircle },
        { label: "Resolved", value: "resolved", icon: XCircle },
      ],
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "created_by",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Created By" />,
    cell: ({ getValue }) => {
      const createdBy = getValue<CreatedBy>()

      return (
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <Avatar>
            <AvatarFallback>{createdBy?.first_name?.[0] ?? "?"}</AvatarFallback>
          </Avatar>

          {createdBy?.first_name ?? "Unknown"}
        </span>
      )
    },
    enableSorting: true,
    size: 200,
  },
  {
    accessorKey: "assigned_to",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Assigned To" />,
    cell: ({ getValue }) => {
      const assignedTo = getValue<AssignedTo>()

      return (
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <Avatar>
            <AvatarFallback>{assignedTo?.first_name?.[0] ?? "?"}</AvatarFallback>
          </Avatar>

          {assignedTo?.first_name ?? "N/A"}
        </span>
      )
    },
    enableSorting: true,
    size: 200,
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
  {
    id: "actions",
    header: "",
    enableSorting: false,
    cell: ({ row }) => (
      <RowMenu row={row.original} setOpen={setOpenTicket} setCurrentDetails={setCurrentDetails} />
    ),
    size: 60,
  },
]

export function SupportTable() {
  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10))
  const [title] = useQueryState("title", parseAsString.withDefault(""))
  const [category] = useQueryState("category", parseAsArrayOf(parseAsString).withDefault([]))
  const [priority] = useQueryState("priority", parseAsArrayOf(parseAsString).withDefault([]))
  const [status] = useQueryState("status", parseAsArrayOf(parseAsString).withDefault([]))
  const [created_at] = useQueryState("created_at", parseAsString.withDefault(""))

  const { data: ticketsData, isLoading } = useGetTickets({
    filters: {
      title: title ?? "",
      page,
      perPage,
      category,
      priority: priority?.[0] ?? "",
      status: status?.[0] ?? "",
      created_at,
    },
  })
  const { createTicket } = useCreateTicket()
  const [openTicket, setOpenTicket] = useState(false) // to open the view details modal
  const [currentDetails, setCurrentDetails] = useState<Ticket | null>(null)

  const handleSubmit = async (values: CreateTicketPayload) => {
    try {
      await createTicket(values)
    } catch (error) {}
    // send to API or mutate state
  }

  const { table } = useDataTable({
    data: ticketsData?.data || [],
    columns: getColumns({ setOpenTicket, setCurrentDetails }),
    pageCount: ticketsData?.totalPages || 0,
    getRowId: (row) => row.id,
    initialState: {
      columnPinning: {
        left: ["select", "id"],
        right: ["actions"],
      },
    },
  })

  return (
    <>
      <div className="overflow-hidden rounded-lg border bg-card w-full">
        <div className="data-table-container p-2">
          <DataTable table={table} isLoading={isLoading}>
            <DataTableToolbar table={table}></DataTableToolbar>
          </DataTable>
        </div>
      </div>

      {currentDetails && openTicket && (
        <TicketDetailsModal
          open={openTicket}
          onOpenChange={setOpenTicket}
          ticket={currentDetails}
          assignees={[
            { id: "default", label: "Default User" },
            { id: "u2", label: "Alex Rivera" },
          ]}
          onSubmit={handleSubmit}
        />
      )}
    </>
  )
}

// put this near your Ticket type
type RowMenuProps = {
  row: Ticket
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setCurrentDetails: React.Dispatch<React.SetStateAction<Ticket | null>>
}

function RowMenu({ row, setOpen, setCurrentDetails }: RowMenuProps) {
  const router = useRouter()

  const handleChatClick = () => {
    router.push(`/support/${row.id}`)
  }

  const handleViewDetails = () => {
    setOpen(true)
    setCurrentDetails(row)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuItem onClick={handleViewDetails} className="text-xs">
          <Layers2 className="mr-2 h-4 w-4" /> View details
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleChatClick} className="text-xs">
          <MessagesSquare className="mr-2 h-4 w-4" /> Chat
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
