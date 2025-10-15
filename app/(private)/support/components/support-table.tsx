"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
  SortingState,
  RowSelectionState,
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

type Ticket = {
  id: string
  subject: string
  category: string
  priority: "low" | "medium" | "high"
  status: "open" | "resolved"
  updated: string
  hasAttachment?: boolean
}

const data: Ticket[] = [
  {
    id: "GP-1042",
    subject: "Webflow not loading",
    category: "Website",
    priority: "high",
    status: "resolved",
    updated: "5m ago",
    hasAttachment: true,
  },
  {
    id: "GP-1040",
    subject: "CRM login issue",
    category: "Ads",
    priority: "high",
    status: "open",
    updated: "1hr ago",
    hasAttachment: true,
  },
  {
    id: "GP-1040",
    subject: "CRM login issue",
    category: "Ads",
    priority: "high",
    status: "open",
    updated: "1hr ago",
    hasAttachment: true,
  },
  {
    id: "GP-1040",
    subject: "CRM login issue",
    category: "Ads",
    priority: "high",
    status: "open",
    updated: "1hr ago",
    hasAttachment: true,
  },
  {
    id: "GP-1040",
    subject: "CRM login issue",
    category: "Ads",
    priority: "high",
    status: "open",
    updated: "1hr ago",
    hasAttachment: true,
  },
  {
    id: "GP-1040",
    subject: "CRM login issue",
    category: "Ads",
    priority: "high",
    status: "open",
    updated: "1hr ago",
    hasAttachment: true,
  },
  {
    id: "GP-1040",
    subject: "CRM login issue",
    category: "Ads",
    priority: "high",
    status: "open",
    updated: "1hr ago",
    hasAttachment: true,
  },
  {
    id: "GP-1040",
    subject: "CRM login issue",
    category: "Ads",
    priority: "high",
    status: "open",
    updated: "1hr ago",
    hasAttachment: true,
  },
  {
    id: "GP-1040",
    subject: "CRM login issue",
    category: "Ads",
    priority: "high",
    status: "open",
    updated: "1hr ago",
    hasAttachment: true,
  },
  {
    id: "GP-1040",
    subject: "CRM login issue",
    category: "Ads",
    priority: "high",
    status: "open",
    updated: "1hr ago",
    hasAttachment: true,
  },
  {
    id: "GP-1040",
    subject: "CRM login issue",
    category: "Ads",
    priority: "high",
    status: "open",
    updated: "1hr ago",
    hasAttachment: true,
  },
  {
    id: "GP-1040",
    subject: "CRM login issue",
    category: "Ads",
    priority: "high",
    status: "open",
    updated: "1hr ago",
    hasAttachment: true,
  },
  {
    id: "GP-1040",
    subject: "CRM login issue",
    category: "Ads",
    priority: "high",
    status: "open",
    updated: "1hr ago",
    hasAttachment: true,
  },
  {
    id: "GP-1040",
    subject: "CRM login issue",
    category: "Ads",
    priority: "high",
    status: "open",
    updated: "1hr ago",
    hasAttachment: true,
  },
  {
    id: "GP-1040",
    subject: "CRM login issue",
    category: "Ads",
    priority: "high",
    status: "open",
    updated: "1hr ago",
    hasAttachment: true,
  },
]

const COL_WIDTHS = {
  select: "w-[40px] max-w-[100px]",
  id: "w-[120px] max-w-[150px]",
  category: "w-[140px] max-w-[200px]",
  priority: "w-[110px] max-w-[200px]",
  status: "w-[120px] max-w-[220px]",
  updated: "w-[110px] max-w-[210px]",
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

// ——— Column definitions (TanStack) ———
const columns: ColumnDef<Ticket>[] = [
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
          {t.hasAttachment && <Paperclip className="h-4 w-4 text-muted-foreground" />}
          <Link href="#" className="hover:underline">
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
      <span className="text-xs text-foreground/90 break-all">{getValue<string>()}</span>
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
    accessorKey: "updated",
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
    cell: ({ row }) => <RowMenu row={row.original} />,
    size: 60,
  },
]

export function SupportTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

  const table = useReactTable({
    data,
    columns,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // sizes help us keep near-pixel parity with the screenshot
    columnResizeMode: "onChange",
    enableSortingRemoval: false,
  })

  return (
    <div className="rounded-lg border bg-card">
      <Table className="text-xs table-fixed">
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableHead
                  key={header.id}
                  style={{
                    width: header.getSize() ? header.getSize() : undefined,
                  }}
                  className={cn(
                    colWidthClass(header.column.id),
                    "text-muted-foreground font-semibold break-all"
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
              className="hover:bg-muted/40"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function StatusBadge({ status }: { status: "open" | "resolved" }) {
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

// put this near your Ticket type
type RowMenuProps = {
  row: Ticket
}

function RowMenu({ row }: RowMenuProps) {
  const router = useRouter()

  const handleChatClick = () => {
    router.push(`/support/${row.id}`)
  }

  const handleViewDetails = () => {
    // router.push(`/details/${row.id}`)
  }

  const handleChangeAssignee = () => {
    // maybe open a modal, etc.
    console.log("Change assignee for", row.id)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuItem onClick={handleChangeAssignee} className="text-xs">
          <User className="mr-2 h-4 w-4" /> Change assignee
        </DropdownMenuItem>

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
