"use client";

import Page from "@/components/base/Page";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  MoreVertical,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

function ClientsPage() {
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const clientsData = [
    {
      id: 1,
      name: "GreenCity Rma",
      payment: "Paid (€2,400)",
      paymentStatus: "paid",
      onboarding: "Started",
      onboardingStatus: "started",
      lastUpdate: "2h ago",
    },
    {
      id: 2,
      name: "Endsorgung24 GmbH",
      payment: "Unpaid (€2,400)",
      paymentStatus: "unpaid",
      onboarding: "—",
      onboardingStatus: "pending",
      lastUpdate: "2h ago",
    },
    {
      id: 3,
      name: "ElektroPius Berlin",
      payment: "Paid (€2,210)",
      paymentStatus: "paid",
      onboarding: "Completed",
      onboardingStatus: "completed",
      lastUpdate: "2h ago",
    },
    {
      id: 4,
      name: "GreenCity Rma",
      payment: "Paid (€2,400)",
      paymentStatus: "paid",
      onboarding: "Started",
      onboardingStatus: "started",
      lastUpdate: "1h ago",
    },
    {
      id: 5,
      name: "Endsorgung24 GmbH",
      payment: "Unpaid (€2,400)",
      paymentStatus: "unpaid",
      onboarding: "—",
      onboardingStatus: "pending",
      lastUpdate: "3h ago",
    },
    {
      id: 6,
      name: "ElektroPius Berlin",
      payment: "Paid (€2,210)",
      paymentStatus: "paid",
      onboarding: "Completed",
      onboardingStatus: "completed",
      lastUpdate: "4h ago",
    },
    {
      id: 7,
      name: "GreenCity Rma",
      payment: "Paid (€2,400)",
      paymentStatus: "paid",
      onboarding: "Started",
      onboardingStatus: "started",
      lastUpdate: "2h ago",
    },
    {
      id: 8,
      name: "Endsorgung24 GmbH",
      payment: "Unpaid (€2,400)",
      paymentStatus: "unpaid",
      onboarding: "—",
      onboardingStatus: "pending",
      lastUpdate: "2h ago",
    },
    {
      id: 9,
      name: "ElektroPius Berlin",
      payment: "Paid (€2,210)",
      paymentStatus: "paid",
      onboarding: "Completed",
      onboardingStatus: "completed",
      lastUpdate: "2h ago",
    },
    {
      id: 10,
      name: "GreenCity Rma",
      payment: "Paid (€2,400)",
      paymentStatus: "paid",
      onboarding: "Started",
      onboardingStatus: "started",
      lastUpdate: "1h ago",
    },
    {
      id: 11,
      name: "Endsorgung24 GmbH",
      payment: "Unpaid (€2,400)",
      paymentStatus: "unpaid",
      onboarding: "—",
      onboardingStatus: "pending",
      lastUpdate: "3h ago",
    },
    {
      id: 12,
      name: "ElektroPius Berlin",
      payment: "Paid (€2,210)",
      paymentStatus: "paid",
      onboarding: "Completed",
      onboardingStatus: "completed",
      lastUpdate: "4h ago",
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

  const sortedData = [...clientsData].sort((a, b) => {
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

  const allClientIds = clientsData.map((c) => c.id);
  const isAllSelected =
    selectedClients.length === clientsData.length && clientsData.length > 0;

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedClients(allClientIds);
    } else {
      setSelectedClients([]);
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-600";
      default:
        return "text-muted-foreground";
    }
  };

  const getOnboardingColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Page
      navURL="Dashboard"
      title="Clients"
      description="Add a new client, record payment, and send onboarding access."
      rightButton={
        <Button asChild className="cursor-pointer rounded">
          <Link href="clients/add">Add new client</Link>
        </Button>
      }
    >
      <div className="flex flex-col gap-4 py-4 flex-1 overflow-y-hidden">
        <Table className="bg-background rounded-xl overflow-y-auto">
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
            {sortedData.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="py-4 px-4">
                  <Checkbox
                    checked={selectedClients.includes(client.id)}
                    onCheckedChange={() => toggleClient(client.id)}
                    className="cursor-pointer"
                  />
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
                    <span>{client.name}</span>
                  </div>
                </TableCell>
                <TableCell
                  className={`text-muted-foreground  ${getPaymentColor(client.paymentStatus)}`}
                >
                  {client.payment}
                </TableCell>
                <TableCell
                  className={`text-muted-foreground ${getOnboardingColor(client.onboardingStatus)}`}
                >
                  {client.onboarding}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {client.lastUpdate}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Page>
  );
}

export default ClientsPage;
