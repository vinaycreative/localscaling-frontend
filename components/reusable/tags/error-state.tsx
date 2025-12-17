import React, { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const ErrorState = ({
  className,
  children,
  message,
}: {
  className?: string
  children?: ReactNode
  message?: ReactNode | string
}) => {
  return (
    <div className={cn("w-full h-full flex items-center justify-center min-h-[400px]", className)}>
      {children ? (
        children
      ) : (
        <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
          <h2 className="mb-6 text-5xl font-semibold">Whoops!</h2>
          <h3 className="mb-1.5 text-3xl font-semibold">Something went wrong</h3>
          {message && <p className="text-muted-foreground mb-6 max-w-sm">{message}</p>}
          <Button asChild size="lg" className="rounded-lg text-base">
            <a href="#">Back to home page</a>
          </Button>
        </div>
      )}
    </div>
  )
}

export default ErrorState
