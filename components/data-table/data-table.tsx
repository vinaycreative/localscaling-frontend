import type * as React from "react"
import { flexRender, type Table as TanstackTable } from "@tanstack/react-table"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getCommonPinningStyles } from "@/lib/data-table"
import { cn } from "@/lib/utils"
import { Skeleton } from "../ui/skeleton"
import { NoData } from "@/components/no-data"

interface DataTableProps<TData> extends React.ComponentProps<"div"> {
  table: TanstackTable<TData>
  actionBar?: React.ReactNode
  isLoading?: boolean
  containerClassName?: string
}

export function DataTable<TData>({
  table,
  actionBar,
  children,
  className,
  containerClassName,
  isLoading = false,
  ...props
}: DataTableProps<TData>) {
  const isEmpty = table.getRowModel().rows?.length === 0
  return (
    <div className={cn("flex w-full flex-col gap-2.5", className)} {...props}>
      {children}
      <Table
        className="text-xs table-fixed w-full"
        containerClassName={cn(
          "relative min-h-[64vh] max-h-[64vh] rounded-md border w-full",
          isEmpty && "overflow-hidden overflow-x-hidden",
          containerClassName
        )}
      >
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  style={{
                    ...getCommonPinningStyles({ column: header.column }),
                    position: "sticky",
                    top: 0,
                    zIndex: header.column.getIsPinned() ? 20 : 10,
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        {isLoading ? (
          <TableBody>
            {Array.from({ length: 9 }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                {Array.from({ length: table.getAllColumns()?.length }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        ...getCommonPinningStyles({ column: cell.column }),
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell>
                  <></>
                  <div className="grid gap-1 place-items-center min-h-[54dvh] w-[86dvw] md:w-[77dvw]">
                    <div className="h-fit flex flex-col items-center justify-center gap-2">
                      <NoData />
                      <h4 className="scroll-m-20 text-xl font-medium tracking-tight text-muted-foreground">
                        No Data Found.
                      </h4>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        )}
      </Table>
      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={table} />
        {actionBar && table.getFilteredSelectedRowModel().rows.length > 0 && actionBar}
      </div>
    </div>
  )
}
