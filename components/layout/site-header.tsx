"use client";

import { ReactNode } from "react";
import { SidebarTrigger } from "../ui/sidebar";

export function SiteHeader({ children }: { children: ReactNode }) {
  return (
    <header className="sticky top-0 inset-x-0 bg-background z-[2] px-3 py-2 flex items-center gap-2">
      <SidebarTrigger className="cursor-pointer md:hidden" />
      {children}
    </header>
  );
}
