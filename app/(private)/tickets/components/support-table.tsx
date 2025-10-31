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
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { TicketDetailsModal } from "./view-details"
// import { Ticket } from "../types"
import { CSSProperties, useState } from "react"
import { useSidebar } from "@/components/ui/sidebar"
import { Ticket } from "@/types/support"

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
    header: ({ column }) => (
      <button
        className="inline-flex items-center gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Ticket ID <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
    ),
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
    accessorKey: "subject",
    header: ({ column }) => (
      <button
        className="inline-flex items-center gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Subject <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
    ),
    cell: ({ getValue }) => (
      <span className="text-xs text-foreground/90 break-words whitespace-break-spaces">
        {getValue<string>()}
      </span>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <button
        className="inline-flex items-center gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Category <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
    ),
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground">{getValue<string>()}</span>
    ),
    enableSorting: true,
    size: 140,
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <button
        className="inline-flex items-center gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Priority <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
    ),
    cell: ({ getValue }) => <span className="text-xs capitalize">{getValue<string>()}</span>,
    enableSorting: true,
    size: 110,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <button
        className="inline-flex items-center gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
    ),
    cell: ({ getValue }) => <StatusBadge status={getValue<"open" | "resolved">()} />,
    enableSorting: true,
    size: 120,
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => (
      <button
        className="inline-flex items-center gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Updated <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
    ),
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
  const [openTicket, setOpenTicket] = useState(false) // to open the view details modal
  const [currentDetails, setCurrentDetails] = useState<Ticket | null>(null)
  const { open, isMobile } = useSidebar()

  const handleSubmit = async (updated_at: Ticket) => {
    // send to API or mutate state
    console.log("Updated ticket:", updated_at)
  }

  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: ["select", "id"],
    right: ["actions"],
  })

  const table = useReactTable({
    data,
    columns: getColumns({ setOpenTicket, setCurrentDetails }),
    state: { sorting, rowSelection, columnPinning }, // ← add,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnPinningChange: setColumnPinning,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // sizes help us keep near-pixel parity with the screenshot
    columnResizeMode: "onChange",
    enableSortingRemoval: false,
  })

  return (
    <>
      <div className="overflow-hidden rounded-lg border bg-card w-full">
        <Table
          className="text-xs table-fixed w-full"
          containerClassName="min-h-[50vh] max-h-[70vh]"
          // containerClassName={cn(
          //   "max-w-[94vw] max-h-[70vh] overflow-y-scroll",
          //   !open && isMobile ? "max-w-[98vw]" : "",
          //   open && !isMobile ? "max-w-[62.6vw] lg:max-w-[88vw]" : ""
          // )}
        >
          <TableHeader>
            {table.getHeaderGroups().map((hg) => {
              return (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => {
                    const isPinnedColumn =
                      columnPinning?.left?.includes(header.column.id) ||
                      columnPinning?.right?.includes(header.column.id)
                    return (
                      <TableHead
                        key={header.id}
                        style={{
                          width: header.getSize() || undefined,
                          ...(isPinnedColumn ? getCommonPinningStyles(header.column) : {}),
                          zIndex: isPinnedColumn ? 2 : 1,
                        }}
                        className={cn(
                          colWidthClass(header.column.id),
                          "text-muted-foreground font-semibold break-all sticky top-0 bg-card"
                        )}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="hover:bg-muted/40"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="break-words bg-card"
                    style={{
                      ...(columnPinning?.left?.includes(cell.column.id) ||
                      columnPinning?.right?.includes(cell.column.id)
                        ? getCommonPinningStyles(cell.column)
                        : {}),
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {currentDetails && (
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

  // const handleChangeAssignee = () => {
  //   // maybe open a modal, etc.
  //   console.log("Change assignee for", row.id)
  // }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[180px]">
        {/* <DropdownMenuItem onClick={handleChangeAssignee} className="text-xs">
          <User className="mr-2 h-4 w-4" /> Change assignee
        </DropdownMenuItem> */}

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