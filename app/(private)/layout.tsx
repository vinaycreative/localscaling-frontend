import MainLayout from "@/components/base/Main"

interface ProtectedLayoutProps {
  children: React.ReactNode
}

function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return <MainLayout>{children}</MainLayout>
}

export default ProtectedLayout
