import React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  className?: string
}

const Loading = (props: Props) => {
  const { className } = props
  return (
    <div className={cn("w-full h-full flex items-center justify-center min-h-dvh", className)}>
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  )
}

export default Loading
