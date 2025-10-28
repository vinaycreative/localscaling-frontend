import MainLayout from "@/components/layouts/Main"

interface ProtectedLayoutProps {
  children: React.ReactNode
}

function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return <MainLayout>{children}</MainLayout>
}

export default ProtectedLayout
