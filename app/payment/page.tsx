import React, { Suspense } from "react"
import PaymentClient from "./PaymentClient"
import Loading from "@/components/Loading"

const PaymentPage = () => {
  return (
    <Suspense fallback={<Loading/>}>
      <PaymentClient />
    </Suspense>
  )
}

export default PaymentPage
