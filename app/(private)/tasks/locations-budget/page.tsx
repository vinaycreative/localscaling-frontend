import { SiteHeader } from "@/components/layout/site-header";
import Image from "next/image";
import { OnboardingHeader } from "../business-information/page";
import { LocationsBudgetForm } from "./form";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 min-h-screen">
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
          <div className="flex w-full flex-col gap-4">
            <div className="space-y-0">
              <h1 className="font-semibold text-foreground">
                5. Locations & Budget
              </h1>
              <p className="text-sm text-muted-foreground">
                Set your ads budget & its location.
              </p>
            </div>

            <div className="relative aspect-video bg-muted rounded overflow-hidden mx-auto">
              <Image
                src="/video.jpg"
                alt="Business consultation video"
                className="w-full h-full object-cover"
                width={300}
                height={300}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-primary/80 rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[12px] border-l-primary-foreground border-y-[8px] border-y-transparent ml-1"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="lg:col-span-2">
          <LocationsBudgetForm />
        </section>
      </div>
    </div>
  );
}
