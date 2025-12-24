"use client"

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
  SortingState,
  RowSelectionState,
  Column,
  ColumnPinningState,
} from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  MoreHorizontal,
  Paperclip,
  ArrowUpDown,
  User,
  Layers2,
  MessagesSquare,
  ChevronsUpDown,
  CheckCircle,
  XCircle,
  CornerRightUp,
  CornerRightDown,
  Minus,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { TicketDetailsModal } from "./view-details"
import { CSSProperties, useMemo, useState } from "react"
import { useSidebar } from "@/components/ui/sidebar"
import { Ticket } from "@/types/support"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { buildFilterQueryParams, parsedFilters } from "@/components/data-table/utils"
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs"
import { useDataTable } from "@/hooks/use-data-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"

const data: Ticket[] = [
  {
    id: "GP-1042",
    title: "Webflow page not loading",
    subject: "Webflow not loading",
    description: "User reports that the Webflow dashboard page fails to load properly in Chrome.",
    category: "Website",
    created_by: "Alex Johnson",
    priority: "high",
    status: "open",
    updated_at: "5m ago",
    attachments: [
      {
        id: "a1",
        name: "design-requirements.pdf",
        sizeKB: 478,
        mime: "application/pdf",
        url: "/uploads/design-requirements.pdf",
      },
      {
        id: "a2",
        name: "error-screenshot.png",
        sizeKB: 320,
        mime: "image/png",
        url: "/uploads/error-screenshot.png",
      },
    ],
  },
  {
    id: "GP-1043",
    title: "CRM login issue",
    subject: "CRM login issue",
    description: "Multiple users are unable to log into the CRM portal using valid credentials.",
    category: "CRM",
    created_by: "Default User",
    priority: "high",
    status: "resolved",
    updated_at: "10m ago",
  },
  {
    id: "GP-1044",
    title: "Broken link on pricing page",
    subject: "Pricing page link broken",
    description: "The 'Contact Sales' link on the pricing page redirects to a 404 error.",
    category: "Website",
    created_by: "Emily Clark",
    priority: "medium",
    status: "open",
    updated_at: "30m ago",
  },
  {
    id: "GP-1045",
    title: "Email notifications not sent",
    subject: "Notification service down",
    description: "No automated emails are being sent for new support tickets.",
    category: "System",
    created_by: "James Miller",
    priority: "high",
    status: "open",
    updated_at: "1hr ago",
  },
  {
    id: "GP-1046",
    title: "Billing statement discrepancy",
    subject: "Billing error in invoice",
    description: "Customer reports an overcharge in the latest invoice for Pro Plan.",
    category: "Billing",
    created_by: "Olivia Davis",
    priority: "medium",
    status: "resolved",
    updated_at: "2hr ago",
    attachments: [
      {
        id: "a3",
        name: "invoice-screenshot.png",
        sizeKB: 265,
        mime: "image/png",
      },
    ],
  },
  {
    id: "GP-1047",
    title: "App crash on iOS 17",
    subject: "iOS app crash",
    description: "App crashes immediately after launch on iOS 17 devices.",
    category: "Mobile App",
    created_by: "Sophia Lee",
    priority: "high",
    status: "open",
    updated_at: "3hr ago",
    attachments: [
      {
        id: "a4",
        name: "crash-log.txt",
        sizeKB: 112,
        mime: "text/plain",
      },
    ],
  },
  {
    id: "GP-1048",
    title: "Slow loading dashboard",
    subject: "Performance issue",
    description: "Users are experiencing slow load times when accessing the analytics dashboard.",
    category: "Backend",
    created_by: "Ethan Brown",
    priority: "medium",
    status: "open",
    updated_at: "5hr ago",
  },
  {
    id: "GP-1049",
    title: "Password reset email delayed",
    subject: "Email delivery delay",
    description: "Password reset emails take over 10 minutes to reach the inbox.",
    category: "System",
    created_by: "Daniel Green",
    priority: "low",
    status: "resolved",
    updated_at: "8hr ago",
  },
  {
    id: "GP-1050",
    title: "Error 500 on checkout",
    subject: "Checkout failure",
    description: "Users encounter a 500 server error when trying to complete checkout.",
    category: "E-commerce",
    created_by: "Default User",
    priority: "high",
    status: "open",
    updated_at: "12hr ago",
    attachments: [
      {
        id: "a5",
        name: "server-log.txt",
        sizeKB: 560,
        mime: "text/plain",
      },
    ],
  },
  {
    id: "GP-1051",
    title: "Missing translations on homepage",
    subject: "Localization issue",
    description: "Some homepage strings are not translated when switching to German locale.",
    category: "Website",
    created_by: "Hannah Kim",
    priority: "low",
    status: "resolved",
    updated_at: "1d ago",
  },
]

const COL_WIDTHS = {
  select: "w-[40px] max-w-[100px]",
  id: "w-[120px] max-w-[150px]",
  category: "w-[140px] max-w-[200px]",
  priority: "w-[110px] max-w-[200px]",
  status: "w-[120px] max-w-[220px]",
  updated_at: "w-[110px] max-w-[210px]",
  actions: "w-[60px] max-w-[160px]",
} as const

/** Returns the Tailwind width class for a header id, plus any extras you pass. */
function colWidthClass(id?: string, extra?: string) {
  // If id is one of our typed keys, use it; otherwise nothing.
  const cls = (id && (COL_WIDTHS as Record<string, string>)[id]) ?? undefined
  // If you use shadcn's cn util, use that instead of simple join.
  return [cls, extra].filter(Boolean).join(" ")
  // return cn(cls, extra) // if you have cn()
}

const demoTicket: Ticket = {
  id: "GP-1040-15",
  title: "CRM login issue",
  subject: "CRM login issue",
  description: "Cannot log into CRM. Error 401 after entering credentials.",
  category: "Ads",
  created_by: "Default User",
  priority: "high",
  status: "open",
  updated_at: "1hr ago",
}

const getCommonPinningStyles = (column: Column<Ticket>): CSSProperties => {
  const isPinned = column.getIsPinned()

  return {
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    opacity: isPinned ? 0.95 : 1,
    position: isPinned ? "sticky" : "relative",
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  }
}

// ─── Column Definitions ──────────────────────────────

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
          <Link href="#" className="truncate hover:underline max-w-[100px] md:max-w-[150px]">
            {t.id}
          </Link>
        </div>
      )
    },
    enableSorting: true,
    size: 130,
  },
  {
    id: "subject",
    accessorKey: "subject",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Subject" />,
    cell: ({ getValue }) => (
      <span className="text-xs text-foreground/90 break-words whitespace-break-spaces">
        {getValue<string>()}
      </span>
    ),
    meta: {
      label: "Subject",
      variant: "text",
    },
    enableSorting: true,
    enableColumnFilter: true,
  },
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
      options: [
        { label: "Website", value: "Website" },
        { label: "CRM", value: "CRM" },
        { label: "Billing", value: "Billing" },
        { label: "System", value: "System" },
        { label: "Mobile App", value: "Mobile App" },
        { label: "Backend", value: "Backend" },
        { label: "E-commerce", value: "E-commerce" },
      ],
    },
    enableColumnFilter: true,
  },
  {
    id: "priority",
    accessorKey: "priority",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Priority" />,
    cell: ({ getValue }) => <span className="text-xs capitalize">{getValue<string>()}</span>,
    enableSorting: true,
    size: 110,
    meta: {
      label: "Priority",
      variant: "select",
      options: [
        { label: "High", value: "high", icon: CornerRightUp },
        { label: "Medium", value: "medium", icon: Minus },
        { label: "Low", value: "low", icon: CornerRightDown },
      ],
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
    accessorKey: "updated_at",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Updated At" />,
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground">{getValue<string>()}</span>
    ),
    enableSorting: true,
    size: 110,
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
  const [subject] = useQueryState("subject", parseAsString.withDefault(""))
  const [category] = useQueryState("category", parseAsArrayOf(parseAsString).withDefault([]))
  const [priority] = useQueryState("priority", parseAsArrayOf(parseAsString).withDefault([]))
  const [status] = useQueryState("status", parseAsArrayOf(parseAsString).withDefault([]))
  console.log({
    filters: {
      subject,
      category,
      priority,
      status,
    },
  })
  const filteredData = useMemo(() => {
    return data.filter((ticket) => {
      const matchesSubject =
        subject === "" || ticket.subject.toLowerCase().includes(subject.toLowerCase())

      const matchesCategory = category.length === 0 || category.includes(ticket.category)

      const matchesPriority = priority.length === 0 || priority.includes(ticket.priority)

      const matchesStatus = status.length === 0 || status.includes(ticket.status)

      return matchesSubject && matchesCategory && matchesPriority && matchesStatus
    })
  }, [subject, category, priority, status])

  const [openTicket, setOpenTicket] = useState(false) // to open the view details modal
  const [currentDetails, setCurrentDetails] = useState<Ticket | null>(null)
  const { open, isMobile } = useSidebar()

  const handleSubmit = async (updated_at: Ticket) => {
    // send to API or mutate state
    console.log("Updated ticket:", updated_at)
  }

  const { table } = useDataTable({
    data: filteredData,
    columns: getColumns({ setOpenTicket, setCurrentDetails }),
    pageCount: 1,
    getRowId: (row) => row.id,
    initialState: {
      sorting: [{ id: "updated_at", desc: true }],
      columnPinning: {
        left: ["select", "id"],
        right: ["actions"],
      },
    },
  })

  console.log("buildFilterQueryParams", String(buildFilterQueryParams(parsedFilters(table))))

  return (
    <>
      <div className="overflow-hidden rounded-lg border bg-card w-full">
        <div className="data-table-container p-2">
          <DataTable table={table}>
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

export function StatusBadge({ status }: { status: "open" | "resolved" }) {
  const style =
    status === "resolved"
      ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200"
      : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200"

  return (
    <Badge
      variant="secondary"
      className={`${style} rounded-full px-2.5 py-0.5 text-xs font-medium capitalize`}
    >
      {status}
    </Badge>
  )
}

export function PriorityBadge({ priority }: { priority: "low" | "medium" | "high" }) {
  const style =
    priority === "low"
      ? "bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-200"
      : priority === "high"
        ? "bg-red-100 text-red-900 ring-1 ring-inset ring-red-200"
        : priority === "medium"
          ? "bg-red-50 text-red-500 ring-1 ring-inset ring-red-200"
          : ""

  return (
    <Badge
      variant="secondary"
      className={`${style} rounded-full px-2.5 py-0.5 text-xs font-medium capitalize`}
    >
      {priority}
    </Badge>
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
