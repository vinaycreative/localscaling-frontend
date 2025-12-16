import type React from "react"
import Page from "@/components/base/Page"
import BusinessInformationForm from "@/form/business-information"
import OnboardingVideo from "@/components/reusable/onboarding-video"

function BusinessInformationPage() {
  return (
    <section className="w-full h-full grid lg:grid-cols-[auto_1fr] gap-4 overflow-hidden pt-4">
      <OnboardingVideo
        title="1. General Business Information"
        subTitle="Provide essential company details."
      />
      <BusinessInformationForm />
    </section>
  )
}

export default BusinessInformationPage
