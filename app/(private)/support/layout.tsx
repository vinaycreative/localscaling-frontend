import MainLayout from "@/components/layout/Main"
import React, { ReactNode } from "react"

export default function page({ children }: { children: ReactNode }) {
  return <MainLayout>{children}</MainLayout>
}
