import { SiteHeader } from "@/components/layout/site-header";
import { OnboardingHeader } from "../business-information/page";
import { MediaCard } from "./media-card";
import { ToolsAccessPanel } from "./tools-access-panel";

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <SiteHeader>
        <OnboardingHeader />
      </SiteHeader>
      <div className="flex flex-col gap-2">
        <h2 className="text-balance text-3xl font-bold">Onboarding Setup</h2>
        <p className="text-pretty text-muted-foreground">
          Complete the required steps to ensure a smooth and successful project
          launch.
        </p>
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <section className="lg:col-span-1">
          <MediaCard />
        </section>

        <section className="lg:col-span-2">
          <ToolsAccessPanel />
        </section>
      </div>
    </div>
  );
}
