"use client";

import Page from "@/components/base/Page";
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

interface Project {
  id: number;
  name: string;
  stage: string;
  assignee: string;
  dueDate: string;
  status: "On time" | "Delayed" | "Pending";
  statusColor: string;
}

function ProjectsPage() {
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const projectsData: Project[] = [
    {
      id: 1,
      name: "ElektroPius Berlin",
      stage: "Branding",
      assignee: "John doe",
      dueDate: "Sep 1, 2025",
      status: "On time",
      statusColor: "bg-green-500",
    },
    {
      id: 2,
      name: "GartenPro Service",
      stage: "Google ads",
      assignee: "John doe",
      dueDate: "Sep 1, 2025",
      status: "Delayed",
      statusColor: "bg-red-500",
    },
    {
      id: 3,
      name: "Solarhaus Solutions",
      stage: "Website setup",
      assignee: "John doe",
      dueDate: "Sep 1, 2025",
      status: "Pending",
      statusColor: "bg-amber-500",
    },
    {
      id: 4,
      name: "Kitchendesign Nord",
      stage: "Branding",
      assignee: "John doe",
      dueDate: "Sep 1, 2025",
      status: "On time",
      statusColor: "bg-green-500",
    },
    {
      id: 5,
      name: "FensterFix24",
      stage: "Google ads",
      assignee: "John doe",
      dueDate: "Sep 1, 2025",
      status: "Delayed",
      statusColor: "bg-red-500",
    },
    {
      id: 6,
      name: "OceanCity Bins",
      stage: "Website setup",
      assignee: "John doe",
      dueDate: "Sep 1, 2025",
      status: "Pending",
      statusColor: "bg-amber-500",
    },
    {
      id: 11,
      name: "ElektroPius Berlin",
      stage: "Branding",
      assignee: "John doe",
      dueDate: "Sep 1, 2025",
      status: "On time",
      statusColor: "bg-green-500",
    },
    {
      id: 21,
      name: "GartenPro Service",
      stage: "Google ads",
      assignee: "John doe",
      dueDate: "Sep 1, 2025",
      status: "Delayed",
      statusColor: "bg-red-500",
    },
    {
      id: 13,
      name: "Solarhaus Solutions",
      stage: "Website setup",
      assignee: "John doe",
      dueDate: "Sep 1, 2025",
      status: "Pending",
      statusColor: "bg-amber-500",
    },
    {
      id: 14,
      name: "Kitchendesign Nord",
      stage: "Branding",
      assignee: "John doe",
      dueDate: "Sep 1, 2025",
      status: "On time",
      statusColor: "bg-green-500",
    },
    {
      id: 15,
      name: "FensterFix24",
      stage: "Google ads",
      assignee: "John doe",
      dueDate: "Sep 1, 2025",
      status: "Delayed",
      statusColor: "bg-red-500",
    },
    {
      id: 26,
      name: "OceanCity Bins",
      stage: "Website setup",
      assignee: "John doe",
      dueDate: "Sep 1, 2025",
      status: "Pending",
      statusColor: "bg-amber-500",
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

  const getSortedData = () => {
    if (!sortColumn) return projectsData;

    const sorted = [...projectsData].sort((a, b) => {
      const aValue = a[sortColumn as keyof Project];
      const bValue = b[sortColumn as keyof Project];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

    return sorted;
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortColumn !== column)
      return <ChevronsUpDown className="w-4 h-4 opacity-40" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  const isAllSelected = selectedProjects.length === projectsData.length;

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProjects(projectsData.map((p) => p.id));
    } else {
      setSelectedProjects([]);
    }
  };

  return (
    <Page
      navURL="Dashboard"
      title="Projects"
      description="Overview of project progress, client assets, and setup status."
    >
      <div className="flex flex-col overflow-hidden py-4">
        <Table className="bg-background rounded-xl overflow-y-auto">
          <TableHeader>
            <TableRow className="border-b border-border hover:bg-transparent">
              <TableHead className="w-12 px-6 py-4">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={toggleSelectAll}
                  className="cursor-pointer"
                />
              </TableHead>
              <TableHead className="px-6 py-4">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer font-medium"
                >
                  Client/Project name
                  <SortIcon column="name" />
                </button>
              </TableHead>
              <TableHead className="px-6 py-4">
                <button
                  onClick={() => handleSort("stage")}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer font-medium"
                >
                  Stage
                  <SortIcon column="stage" />
                </button>
              </TableHead>
              <TableHead className="px-6 py-4">
                <button
                  onClick={() => handleSort("assignee")}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer font-medium"
                >
                  Assignee
                  <SortIcon column="assignee" />
                </button>
              </TableHead>
              <TableHead className="px-6 py-4">
                <button
                  onClick={() => handleSort("dueDate")}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer font-medium"
                >
                  Due date
                  <SortIcon column="dueDate" />
                </button>
              </TableHead>
              <TableHead className="px-6 py-4">
                <button
                  onClick={() => handleSort("status")}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer font-medium"
                >
                  Status
                  <SortIcon column="status" />
                </button>
              </TableHead>
              <TableHead className="w-12 px-6 py-4"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getSortedData().map((project) => (
              <TableRow
                key={project.id}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <TableCell className="px-6 py-4">
                  <Checkbox
                    checked={selectedProjects.includes(project.id)}
                    onCheckedChange={() => toggleProject(project.id)}
                    className="cursor-pointer"
                  />
                </TableCell>
                <TableCell className="px-6 py-4 font-medium text-foreground">
                  {project.name}
                </TableCell>
                <TableCell className="px-6 py-4 text-muted-foreground">
                  {project.stage}
                </TableCell>
                <TableCell className="px-6 py-4 text-muted-foreground">
                  {project.assignee}
                </TableCell>
                <TableCell className="px-6 py-4 text-muted-foreground">
                  {project.dueDate}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${project.statusColor}`}
                    ></div>
                    <span className="text-muted-foreground">
                      {project.status}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <button className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Page>
  );
}

export default ProjectsPage;
