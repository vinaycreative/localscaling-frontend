import { SiteHeader } from "@/components/layout/site-header";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { LaunchDateCard } from "./components/launch-date-card";
import { MilestoneCard } from "./components/milestone-card";
import { ProjectProgressCard } from "./components/project-progress-card";

function DashboardPage() {
  return (
    <div className="min-h-screen px-6">
      <SiteHeader>
        <div className="flex items-center justify-between py-3">
          <Link
            href="/tasks/business-information"
            className="flex items-center gap-1 group cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-[2px] transition-all duration-300" />
            <span className="text-sm text-foreground">Tasks pending</span>
            <span className="text-sm text-destructive ml-1">[23]</span>
          </Link>
        </div>
      </SiteHeader>

      <div>
        <h1 className="mb-8 text-3xl font-bold text-foreground">
          GartenPro Service
        </h1>

        <div className="grid gap-6 md:grid-cols-3">
          <ProjectProgressCard progress={28} />
          <MilestoneCard milestone="Website setup" />
          <LaunchDateCard date="31 December 2025" />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
