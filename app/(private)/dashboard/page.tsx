import { Suspense } from "react"
import Dashboard from "./Dashboard"
import Loading from "@/components/Loading"

const DashboardPage = () => {
  return (
    <Suspense fallback={<Loading/>}>
      <Dashboard />
    </Suspense>
  )
}

export default DashboardPage
