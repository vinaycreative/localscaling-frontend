import { SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "../sidebar/app-sidebar"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      {children}
    </SidebarProvider>
  )
}
