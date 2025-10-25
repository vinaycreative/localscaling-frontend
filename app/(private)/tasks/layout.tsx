import MainLayout from "@/components/layout/main";
import { SiteHeader } from "@/components/layout/site-header";
import React from "react";
import OnboardingHeader from "./components/onboarding-header";

interface TasksLayoutProps {
  children: React.ReactNode;
}

function TaskLayout({ children }: TasksLayoutProps) {
  return (
    <MainLayout>
      <div className="flex flex-col">
        <SiteHeader>
          <OnboardingHeader />
        </SiteHeader>
        {children}
      </div>
    </MainLayout>
  );
}

export default TaskLayout;
