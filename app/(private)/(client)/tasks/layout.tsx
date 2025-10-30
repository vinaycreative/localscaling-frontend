import Page from "@/components/base/Page";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Page
      navURL="Dashboard"
      navURLCount="23"
      title="Onboarding Setup"
      description="Complete the required steps to ensure a smooth and successful project launch."
    >
      <section className="h-full grid grid-rows-[1fr] overflow-hidden">
        {/* <div className="flex flex-col">
          <h2 className="text-xl font-bold">Onboarding Setup</h2>
          <p className="text-muted-foreground text-xs">
            Complete the required steps to ensure a smooth and successful project launch.
          </p>
        </div> */}
        {children}
      </section>
    </Page>
  );
};

export default layout;
