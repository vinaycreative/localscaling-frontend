import OnboardingVideo from "@/components/reusable/onboarding-video"
import WebsiteSetupOnboardingForm from "@/form/website-setup"

export default function WebsiteSetupPage() {
  return (
    <section className="w-full h-full grid lg:grid-cols-[auto_1fr] gap-4 overflow-hidden pt-4">
      <OnboardingVideo
        title="3. Website Setup"
        subTitle="Define your project scope and objectives."
      />
      <WebsiteSetupOnboardingForm />
    </section>
  )
}
