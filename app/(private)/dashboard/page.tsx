import { Suspense } from "react"
import Dashboard from "./Dashboard"

const DashboardPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard />
    </Suspense>
  )
}

export default DashboardPage
