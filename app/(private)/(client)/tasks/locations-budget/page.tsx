import type React from "react"
import OnboardingVideo from "@/components/reusable/onboarding-video"
import { LocationsBudgetOnboardingForm } from "@/form/locations-budget"

export default function LocationsBudgetPage() {
  return (
    <section className="w-full h-full grid lg:grid-cols-[auto_1fr] gap-4 overflow-hidden pt-4">
      <OnboardingVideo
        title="5. Locations & Budget"
        subTitle="Set your ads budget and its location."
      />
      <LocationsBudgetOnboardingForm />
    </section>
  )
}
