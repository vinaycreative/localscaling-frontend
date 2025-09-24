import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../sidebar/app-sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 flex-col p-4">{children}</div>
    </SidebarProvider>
  );
}
