import Page from "@/components/layout/page";
import { LaunchDateCard } from "./components/launch-date-card";
import { MilestoneCard } from "./components/milestone-card";
import { ProjectProgressCard } from "./components/project-progress-card";

function DashboardPage() {
  return (
    <Page navURL="Tasks Pending" navURLCount="23">
      <div className="px-4">
        <h1 className="mb-8 text-3xl font-semibold text-foreground">
          GartenPro Service
        </h1>

        <div className="grid gap-6 lg:grid-cols-3">
          <ProjectProgressCard progress={28} />
          <MilestoneCard milestone="Website setup" />
          <LaunchDateCard date="31 December 2025" />
        </div>
      </div>
    </Page>
  );
}

export default DashboardPage;
