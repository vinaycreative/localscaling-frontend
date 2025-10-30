"use client";

import Page from "@/components/base/Page";
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
} from "lucide-react";
import { useState } from "react";

function Dashboard() {
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const metrics = [
    { label: "Active projects", value: "82" },
    { label: "Pending client actions", value: "13" },
    { label: "Pending tasks", value: "3" },
  ];

  const projectsData = [
    {
      id: 1,
      name: "GreenCity Bins",
      stage: "Branding",
      owner: "John doe",
      lastUpdate: "Sep 1, 2025",
      status: "On time",
      statusColor: "bg-green-500",
    },
    {
      id: 2,
      name: "Enterprising24 GmbH",
      stage: "Google ads",
      owner: "John doe",
      lastUpdate: "Sep 1, 2025",
      status: "Delayed",
      statusColor: "bg-red-500",
    },
    {
      id: 3,
      name: "ElektroPius Berlin",
      stage: "Website setup",
      owner: "John doe",
      lastUpdate: "Sep 1, 2025",
      status: "Pending",
      statusColor: "bg-yellow-500",
    },
    {
      id: 4,
      name: "GreenCity Bins",
      stage: "Branding",
      owner: "John doe",
      lastUpdate: "Sep 1, 2025",
      status: "On time",
      statusColor: "bg-green-500",
    },
    {
      id: 5,
      name: "Enterprising24 GmbH",
      stage: "Google ads",
      owner: "John doe",
      lastUpdate: "Sep 1, 2025",
      status: "Delayed",
      statusColor: "bg-red-500",
    },
    {
      id: 6,
      name: "ElektroPius Berlin",
      stage: "Website setup",
      owner: "John doe",
      lastUpdate: "Sep 1, 2025",
      status: "Pending",
      statusColor: "bg-yellow-500",
    },
    {
      id: 7,
      name: "GreenCity Bins",
      stage: "Branding",
      owner: "John doe",
      lastUpdate: "Sep 1, 2025",
      status: "On time",
      statusColor: "bg-green-500",
    },
    {
      id: 8,
      name: "Enterprising24 GmbH",
      stage: "Google ads",
      owner: "John doe",
      lastUpdate: "Sep 1, 2025",
      status: "Delayed",
      statusColor: "bg-red-500",
    },
    {
      id: 9,
      name: "ElektroPius Berlin",
      stage: "Website setup",
      owner: "John doe",
      lastUpdate: "Sep 1, 2025",
      status: "Pending",
      statusColor: "bg-yellow-500",
    },
    {
      id: 10,
      name: "GreenCity Bins",
      stage: "Branding",
      owner: "John doe",
      lastUpdate: "Sep 1, 2025",
      status: "On time",
      statusColor: "bg-green-500",
    },
    {
      id: 11,
      name: "Enterprising24 GmbH",
      stage: "Google ads",
      owner: "John doe",
      lastUpdate: "Sep 1, 2025",
      status: "Delayed",
      statusColor: "bg-red-500",
    },
    {
      id: 12,
      name: "ElektroPius Berlin",
      stage: "Website setup",
      owner: "John doe",
      lastUpdate: "Sep 1, 2025",
      status: "Pending",
      statusColor: "bg-yellow-500",
    },
  ];

  const toggleProject = (id: number) => {
    setSelectedProjects((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
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

  const sortedProjects = [...projectsData].sort((a, b) => {
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

  const allProjectIds = projectsData.map((p) => p.id);
  const isAllSelected =
    selectedProjects.length === projectsData.length && projectsData.length > 0;

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProjects(allProjectIds);
    } else {
      setSelectedProjects([]);
    }
  };

  return (
    <Page
      navURL="Dashboard"
      title="Dashboard"
      description="Overview of recent active projects, their progress, key metrics, and
          overall performance status."
    >
      <div className="flex-1 flex flex-col gap-4 overflow-hidden py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {metrics.map((metric, index) => (
            <Card key={index} className="bg-card border rounded-md gap-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </CardTitle>
                <button className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {metric.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Recent project details
            </h2>
            <p className="text-muted-foreground text-xs">
              Overview of project progress, client assets, and setup status.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={"outline"}
              className="text-muted-foreground hover:text-foreground cursor-pointer"
            >
              View all
            </Button>
            <button className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

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
                  onClick={() => handleSort("stage")}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 cursor-pointer"
                >
                  Stage
                  <SortIcon column="stage" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort("owner")}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 cursor-pointer"
                >
                  Owner
                  <SortIcon column="owner" />
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
            {sortedProjects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="py-4  px-4">
                  <Checkbox
                    checked={selectedProjects.includes(project.id)}
                    onCheckedChange={() => toggleProject(project.id)}
                    className="cursor-pointer"
                  />
                </TableCell>
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {project.stage}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {project.owner}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {project.lastUpdate}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${project.statusColor}`}
                    ></div>
                    <span>{project.status}</span>
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

export default Dashboard;
