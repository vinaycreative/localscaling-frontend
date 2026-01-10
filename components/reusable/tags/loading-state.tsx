import React, { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const LoadingState = ({ className, children }: { className?: string; children?: ReactNode }) => {
  return (
    <div
      className={cn(
        "w-full h-full flex items-center justify-center pt-4 bg-white rounded-lg border border-gray-300",
        className
      )}
    >
      {children ? children : <Loader2 className="w-8 h-8 animate-spin text-primary" />}
    </div>
  )
}

export default LoadingState
