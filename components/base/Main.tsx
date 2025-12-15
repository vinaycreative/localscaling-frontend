"use client"
import { SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "../sidebar/app-sidebar"
import { useLoggedInUser } from "@/hooks/useAuth"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  // const { user, isLoading } = useLoggedInUser()
  // if (isLoading) {
  //   return (
  //     <main className="flex h-screen w-full items-center justify-center bg-gray-50">
  //       <span className="loader"></span>
  //     </main>
  //   )
  // }
  // console.log("user is ", user)
  return (
    <SidebarProvider>
      <AppSidebar />
      {children}
    </SidebarProvider>
  )
}
