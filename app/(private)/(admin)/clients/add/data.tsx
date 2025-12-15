"use client"
import { Fragment, useState } from "react"
import { useGetClientLeads } from "@/hooks/useClientLead"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronsUpDown, ChevronUp, ChevronDown } from "lucide-react"
import Image from "next/image"
import moment from "moment"

export const ClinetData = () => {
  const { data, isLoading, error } = useGetClientLeads()
  const [selectedClients, setSelectedClients] = useState<number[]>([])
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const toggleClient = (id: number) => {
    setSelectedClients((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const sortedData = data?.sort((a, b) => {
    if (!sortColumn) return 0

    const aValue = a[sortColumn as keyof typeof a]
    const bValue = b[sortColumn as keyof typeof b]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return 0
  })

  const SortIcon = ({ column }: { column: string }) => {
    if (sortColumn !== column) return <ChevronsUpDown className="w-4 h-4 opacity-40" />
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    )
  }

  const allClientIds = data?.map((c) => c.id)
  const isAllSelected = selectedClients.length === (data?.length || 0) && (data?.length || 0) > 0

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedClients(allClientIds as unknown as number[])
    } else {
      setSelectedClients([])
    }
  }

  const getPaymentColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-600"
      default:
        return "text-muted-foreground"
    }
  }

  const getOnboardingColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="flex flex-col gap-4 py-4 flex-1 h-full">
      <Table className="bg-background rounded-xl">
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 px-4">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={toggleSelectAll}
                className="cursor-pointer"
              />
            </TableHead>
            <TableHead>
              <button
                onClick={() => handleSort("name")}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 cursor-pointer"
              >
                Company name
                <SortIcon column="name" />
              </button>
            </TableHead>
            <TableHead>
              <button
                onClick={() => handleSort("name")}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 cursor-pointer"
              >
                Client/Project name
                <SortIcon column="name" />
              </button>
            </TableHead>
            <TableHead>
              <button
                onClick={() => handleSort("payment")}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 cursor-pointer"
              >
                Payment
                <SortIcon column="payment" />
              </button>
            </TableHead>
            <TableHead>
              <button
                onClick={() => handleSort("onboarding")}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 cursor-pointer"
              >
                Onboarding
                <SortIcon column="onboarding" />
              </button>
            </TableHead>
            <TableHead>
              <button
                onClick={() => handleSort("lastUpdate")}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 cursor-pointer"
              >
                Last update
                <SortIcon column="lastUpdate" />
              </button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData?.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="py-4 px-4">
                <Checkbox
                  checked={selectedClients.includes(client?.id as unknown as number)}
                  onCheckedChange={() => toggleClient(client?.id as unknown as number)}
                  className="cursor-pointer"
                />
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <span>{client?.company_name}</span>
                </div>
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Image
                    src="/pdf.png"
                    alt="PDF icon"
                    width={40}
                    height={40}
                    className="opacity-90"
                  />
                  <span>{client?.name}</span>
                </div>
              </TableCell>
              <TableCell
                className={`text-muted-foreground  ${getPaymentColor(client?.monthly_payment_excluding_taxes)}`}
              >
                {client.monthly_payment_excluding_taxes}
              </TableCell>
              <TableCell className={`text-muted-foreground ${getOnboardingColor(client?.state)}`}>
                {client.state}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {moment(client?.created_at).format("lll")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
