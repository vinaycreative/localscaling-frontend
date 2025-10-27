import Page from "@/components/layout/Page";
import { LaunchDateCard } from "../../../components/stats/launch-date-card";
import { MilestoneCard } from "../../../components/stats/milestone-card";
import { ProjectProgressCard } from "../../../components/stats/project-progress-card";

function DashboardPage() {
  return (
    <Page
      navURL="Tasks Pending"
      navURLCount="23"
      title="GartenPro Service"
      description="Complete the required steps to ensure a smooth and successful project launch."
    >
      <section className="bg-green-500 h-full overflow-hidden grid grid-rows-[40px_1fr]">
        <h1 className="mb-8 text-3xl font-semibold text-foreground">
          GartenPro Service
        </h1>

        <div className="grid gap-4 lg:grid-cols-3 h-full overflow-auto">
          <ProjectProgressCard progress={28} />
          <MilestoneCard milestone="Website setup" />
          <LaunchDateCard date="31 December 2025" />
          <ProjectProgressCard progress={28} />
          <MilestoneCard milestone="Website setup" />
          <LaunchDateCard date="31 December 2025" />
          <ProjectProgressCard progress={28} />
          <MilestoneCard milestone="Website setup" />
          <LaunchDateCard date="31 December 2025" />
          <ProjectProgressCard progress={28} />
          <MilestoneCard milestone="Website setup" />
          <LaunchDateCard date="31 December 2025" />
          <ProjectProgressCard progress={28} />
          <MilestoneCard milestone="Website setup" />
          <LaunchDateCard date="31 December 2025" />
          <ProjectProgressCard progress={28} />
          <MilestoneCard milestone="Website setup" />
          <LaunchDateCard date="31 December 2025" />
          <ProjectProgressCard progress={28} />
          <MilestoneCard milestone="Website setup" />
          <LaunchDateCard date="31 December 2025" />
          <ProjectProgressCard progress={28} />
          <MilestoneCard milestone="Website setup" />
          <LaunchDateCard date="31 December 2025" />
          <ProjectProgressCard progress={28} />
          <MilestoneCard milestone="Website setup" />
          <LaunchDateCard date="31 December 2025" />
          <ProjectProgressCard progress={28} />
          <MilestoneCard milestone="Website setup" />
          <LaunchDateCard date="31 December 2025" />
          <ProjectProgressCard progress={28} />
          <MilestoneCard milestone="Website setup" />
          <LaunchDateCard date="31 December 2025" />
          <ProjectProgressCard progress={28} />
          <MilestoneCard milestone="Website setup" />
          <LaunchDateCard date="31 December 2025" />
          <ProjectProgressCard progress={28} />
          <MilestoneCard milestone="Website setup" />
          <LaunchDateCard date="31 December 2025" />
          <ProjectProgressCard progress={28} />
          <MilestoneCard milestone="Website setup" />
          <LaunchDateCard date="31 December 2025" />
          <ProjectProgressCard progress={28} />
          <MilestoneCard milestone="Website setup" />
          <LaunchDateCard date="31 December 2025" />
          <ProjectProgressCard progress={28} />
          <MilestoneCard milestone="Website setup" />
          <LaunchDateCard date="31 December 2025" />
          <ProjectProgressCard progress={28} />
          <MilestoneCard milestone="Website setup" />
          <LaunchDateCard date="31 December 2025" />
          <ProjectProgressCard progress={28} />
          <MilestoneCard milestone="Website setup" />
          <LaunchDateCard date="31 December 2025" />
        </div>
      </section>
    </Page>
  );
}

export default DashboardPage;
