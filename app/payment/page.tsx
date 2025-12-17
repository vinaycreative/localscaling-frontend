import React, { Suspense } from "react"
import PaymentClient from "./PaymentClient"

const PaymentPage = () => {
  return (
    <Suspense>
      <PaymentClient />
    </Suspense>
  )
}

export default PaymentPage
