"use client"
import Page from "@/components/base/Page"
import { CheckCircle } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useSuccessPayment } from "@/hooks/useClientLead"
import { useEffect, useState } from "react"
import { getApiErrorMessage } from "@/utils/formatAxiosError"

// /payment?success=asdasdad
function PaymentPage() {
  const searchParams = useSearchParams()
  const success = searchParams.get("success")
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<{
    id: string
    email: string
    password: string
    first_name: string
    last_name: string | null
    created_at: string
    updated_at: string
    role: string
  }>({
    id: "",
    email: "",
    password: "",
    first_name: "",
    last_name: null,
    created_at: "",
    updated_at: "",
    role: "",
  })

  const { mutate: successPayment, isPending, isError, isSuccess } = useSuccessPayment()

  useEffect(() => {
    if (success) {
      successPayment(success, {
        onSuccess: (data) => {
          setData(data)
        },
        onError: (error) => {
          console.log("error is ", error)
          console.log("error message is ", getApiErrorMessage(error))
          setError(getApiErrorMessage(error))
        },
      })
    }
  }, [success])

  return (
    <main className="bg-gray-50 border rounded-md p-4 flex flex-col justify-center items-center gap-4 w-full h-dvh">
      {isPending && !isError ? (
        <p className="text-muted-foreground text-sm">Processing...</p>
      ) : (
        <>
          {isError ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : isSuccess ? (
            <>
              <CheckCircle className="w-10 h-10 text-green-500" />
              <h1 className="text-2xl font-bold">Completed</h1>
              <p className="text-muted-foreground">Payment completed successfully</p>
              <p className="text-muted-foreground text-sm">Client Name: {data.first_name}</p>
              <p className="text-muted-foreground text-sm">
                Login Credentials shared via email:{" "}
                <span className="font-medium">{data.email}</span>
              </p>
            </>
          ) : null}
        </>
      )}
    </main>
  )
}

export default PaymentPage
