"use client";

import { ReactNode } from "react";
import { SidebarTrigger } from "../ui/sidebar";

function Header({ children }: { children: ReactNode }) {
  return (
    <div className="pt-2 ">
      <header className="flex items-center gap-2 h-16">
        <SidebarTrigger className="cursor-pointer md:hidden" />
        {children}
      </header>
    </div>
  );
}

export default Header;
