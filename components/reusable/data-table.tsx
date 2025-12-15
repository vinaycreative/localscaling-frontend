"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

export type ColumnDef<T> = {
  accessorKey: keyof T | string
  header: string | ((props: { column: string }) => React.ReactNode)
  cell?: (row: T) => React.ReactNode
  sortable?: boolean
  width?: string
  className?: string
  headerClassName?: string
}

export interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  enableSelection?: boolean
  onSelectionChange?: (selectedIds: (string | number)[]) => void
  getRowId?: (row: T) => string | number
  className?: string
  rowClassName?: string | ((row: T) => string)
  onRowClick?: (row: T) => void
}

function SortIcon({
  column,
  sortColumn,
  sortDirection,
}: {
  column: string
  sortColumn: string | null
  sortDirection: "asc" | "desc"
}) {
  if (sortColumn !== column) return <ChevronsUpDown className="w-4 h-4 opacity-40" />
  return sortDirection === "asc" ? (
    <ChevronUp className="w-4 h-4" />
  ) : (
    <ChevronDown className="w-4 h-4" />
  )
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  enableSelection = false,
  onSelectionChange,
  getRowId = (row: T) => (row as any).id,
  className,
  rowClassName,
  onRowClick,
}: DataTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([])
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const sortedData = useMemo(() => {
    if (!sortColumn) return data

    const sorted = [...data].sort((a, b) => {
      const aValue = a[sortColumn as keyof T]
      const bValue = b[sortColumn as keyof T]

      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }

      return 0
    })

    return sorted
  }, [data, sortColumn, sortDirection])

  const toggleRow = (id: string | number) => {
    const newSelection = selectedRows.includes(id)
      ? selectedRows.filter((r) => r !== id)
      : [...selectedRows, id]
    setSelectedRows(newSelection)
    onSelectionChange?.(newSelection)
  }

  const toggleSelectAll = (checked: boolean) => {
    const allIds = sortedData.map((row) => getRowId(row))
    const newSelection = checked ? allIds : []
    setSelectedRows(newSelection)
    onSelectionChange?.(newSelection)
  }

  const isAllSelected =
    sortedData.length > 0 && sortedData.every((row) => selectedRows.includes(getRowId(row)))

  const isSomeSelected = sortedData.some((row) => selectedRows.includes(getRowId(row)))

  const selectAllCheckboxRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      const input = selectAllCheckboxRef.current.querySelector(
        'input[type="checkbox"]'
      ) as HTMLInputElement
      if (input) {
        input.indeterminate = isSomeSelected && !isAllSelected
      }
    }
  }, [isAllSelected, isSomeSelected])

  return (
    <div className={cn("flex flex-col h-full overflow-hidden", className)}>
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <div className="overflow-y-auto flex-1 min-h-0">
          <div className="bg-background rounded-xl">
            <Table containerClassName="overflow-visible">
              <TableHeader className="sticky top-0 z-10 bg-background shadow-sm">
                <TableRow className="border-b border-border hover:bg-transparent">
                  {enableSelection && (
                    <TableHead className="w-12 px-6 py-4">
                      <Checkbox
                        ref={selectAllCheckboxRef}
                        checked={isAllSelected}
                        onCheckedChange={toggleSelectAll}
                        className="cursor-pointer"
                      />
                    </TableHead>
                  )}
                  {columns.map((column, index) => {
                    const columnKey =
                      typeof column.accessorKey === "string"
                        ? column.accessorKey
                        : String(column.accessorKey)
                    const isSortable = column.sortable !== false

                    return (
                      <TableHead
                        key={index}
                        className={cn("px-6 py-4", column.headerClassName)}
                        style={column.width ? { width: column.width } : undefined}
                      >
                        {typeof column.header === "string" ? (
                          isSortable ? (
                            <button
                              onClick={() => handleSort(columnKey)}
                              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer font-medium"
                            >
                              {column.header}
                              <SortIcon
                                column={columnKey}
                                sortColumn={sortColumn}
                                sortDirection={sortDirection}
                              />
                            </button>
                          ) : (
                            <span className="text-muted-foreground font-medium">
                              {column.header}
                            </span>
                          )
                        ) : (
                          column.header({ column: columnKey })
                        )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((row, rowIndex) => {
                  const rowId = getRowId(row)
                  const isSelected = selectedRows.includes(rowId)
                  const rowClass =
                    typeof rowClassName === "function" ? rowClassName(row) : rowClassName

                  return (
                    <TableRow
                      key={rowId}
                      className={cn(
                        "border-b border-border hover:bg-muted/50 transition-colors",
                        isSelected && "bg-muted/30",
                        rowClass,
                        onRowClick && "cursor-pointer"
                      )}
                      onClick={() => onRowClick?.(row)}
                    >
                      {enableSelection && (
                        <TableCell className="px-6 py-4">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleRow(rowId)}
                            className="cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </TableCell>
                      )}
                      {columns.map((column, colIndex) => {
                        const cellValue = row[column.accessorKey as keyof T]
                        return (
                          <TableCell key={colIndex} className={cn("px-6 py-4", column.className)}>
                            {column.cell
                              ? column.cell(row)
                              : cellValue !== null && cellValue !== undefined
                                ? String(cellValue)
                                : ""}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}
