"use client";

import { ReactNode } from "react";
import { SidebarTrigger } from "../ui/sidebar";

export function SiteHeader({ children }: { children: ReactNode }) {
  return (
    <div className="py-2 px-4">
      <header className="flex items-center gap-2 h-16">
        <SidebarTrigger className="cursor-pointer md:hidden" />
        {children}
      </header>
    </div>
  );
}
