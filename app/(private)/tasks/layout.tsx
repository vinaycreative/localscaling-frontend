import React from "react"
import Page from "@/components/layout/Page"

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Page navURL="Dashboard" navURLCount="23">
      <section className="h-full grid grid-rows-[44px_1fr] overflow-hidden">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold">Onboarding Setup</h2>
          <p className="text-muted-foreground text-xs">
            Complete the required steps to ensure a smooth and successful project launch.
          </p>
        </div>
        {children}
      </section>
    </Page>
  )
}

export default layout
