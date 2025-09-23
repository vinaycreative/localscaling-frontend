import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../sidebar/app-sidebar";
import { SiteHeader } from "../site-header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
       <SiteHeader />
        <div className="flex flex-1 flex-col p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
