import MainLayout from "@/components/layout/main";
import React, { ReactNode } from "react";

export default function page({ children }: { children: ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
