"use client";

import Page from "@/components/layouts/Page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  MoreVertical,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

function FinancePage() {
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const metrics = [
    {
      label: "Total revenue (This month)",
      value: "82",
      trend: "+12.5%",
      positive: true,
    },
    { label: "Total ad spend", value: "13", trend: "-3.2%", positive: false },
    { label: "Active clients", value: "3", trend: "+2", positive: true },
  ];

  const financialData = [
    {
      id: 1,
      name: "Enterprising24 GmbH",
      revenue: "€2,800",
      adSpend: "€950",
      profitMargin: "66%",
      status: "Active",
      statusColor: "bg-green-500",
    },
    {
      id: 2,
      name: "ElektroPius Berlin",
      revenue: "€2,800",
      adSpend: "€470",
      profitMargin: "78%",
      status: "Inactive",
      statusColor: "bg-red-500",
    },
    {
      id: 3,
      name: "GartenPro Service",
      revenue: "€2,400",
      adSpend: "€1,100",
      profitMargin: "54%",
      status: "Renewal",
      statusColor: "bg-yellow-500",
    },
    {
      id: 11,
      name: "Enterprising24 GmbH",
      revenue: "€2,800",
      adSpend: "€950",
      profitMargin: "66%",
      status: "Active",
      statusColor: "bg-green-500",
    },
    {
      id: 21,
      name: "ElektroPius Berlin",
      revenue: "€2,800",
      adSpend: "€470",
      profitMargin: "78%",
      status: "Inactive",
      statusColor: "bg-red-500",
    },
    {
      id: 31,
      name: "GartenPro Service",
      revenue: "€2,400",
      adSpend: "€1,100",
      profitMargin: "54%",
      status: "Renewal",
      statusColor: "bg-yellow-500",
    },
    {
      id: 4,
      name: "Enterprising24 GmbH",
      revenue: "€2,800",
      adSpend: "€950",
      profitMargin: "66%",
      status: "Active",
      statusColor: "bg-green-500",
    },
    {
      id: 5,
      name: "ElektroPius Berlin",
      revenue: "€2,800",
      adSpend: "€470",
      profitMargin: "78%",
      status: "Inactive",
      statusColor: "bg-red-500",
    },
    {
      id: 6,
      name: "GartenPro Service",
      revenue: "€2,400",
      adSpend: "€1,100",
      profitMargin: "54%",
      status: "Renewal",
      statusColor: "bg-yellow-500",
    },
  ];

  const toggleClient = (id: number) => {
    setSelectedClients((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedData = [...financialData].sort((a, b) => {
    if (!sortColumn) return 0;

    const aValue = a[sortColumn as keyof typeof a];
    const bValue = b[sortColumn as keyof typeof b];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  const SortIcon = ({ column }: { column: string }) => {
    if (sortColumn !== column)
      return <ChevronsUpDown className="w-4 h-4 opacity-40" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  const allClientIds = financialData.map((c) => c.id);
  const isAllSelected =
    selectedClients.length === financialData.length && financialData.length > 0;

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedClients(allClientIds);
    } else {
      setSelectedClients([]);
    }
  };

  return (
    <Page
      navURL="Dashboard"
      title="Finance"
      description="Overview of key financial metrics, revenue performance, and client
          billing status."
    >
      <div className="flex flex-col gap-4 py-4 flex-1 overflow-y-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {metrics.map((metric, index) => (
            <Card key={index} className="bg-card border rounded-md gap-2 p-4">
              <div className="flex flex-row items-center justify-between ">
                <h2 className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </h2>
                <button className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold text-foreground">
                  {metric.value}
                </div>
                <div
                  className={`flex items-center gap-1 text-sm ${metric.positive ? "text-green-600" : "text-red-600"}`}
                >
                  {metric.positive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{metric.trend}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold text-foreground">
            Financial Overview
          </h2>
          <Button
            variant={"outline"}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            Export CSV
          </Button>
        </div>

        <Table className="bg-background flex-1 overflow-auto rounded-2xl">
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
                  Client/Project name
                  <SortIcon column="name" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort("revenue")}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 cursor-pointer"
                >
                  Revenue (This month)
                  <SortIcon column="revenue" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort("adSpend")}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 cursor-pointer"
                >
                  Ad spend
                  <SortIcon column="adSpend" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort("profitMargin")}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 cursor-pointer"
                >
                  Profit margin
                  <SortIcon column="profitMargin" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort("status")}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 cursor-pointer"
                >
                  Status
                  <SortIcon column="status" />
                </button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="py-4 px-4">
                  <Checkbox
                    checked={selectedClients.includes(client.id)}
                    onCheckedChange={() => toggleClient(client.id)}
                    className="cursor-pointer"
                  />
                </TableCell>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell className="text-muted-foreground font-semibold">
                  {client.revenue}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {client.adSpend}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {client.profitMargin}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${client.statusColor}`}
                    ></div>
                    <span>{client.status}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Page>
  );
}

export default FinancePage;
