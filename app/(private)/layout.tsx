import MainLayout from "@/components/layouts/main"

interface ProtectedLayoutProps {
  children: React.ReactNode
}

function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return <MainLayout>{children}</MainLayout>
}

export default ProtectedLayout
