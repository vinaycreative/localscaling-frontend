import { cn } from "@/lib/utils"
import React, { ReactNode } from "react"

type FormLayoutProps = {
  className?: string
  headerClassName?: string
  footerClassName?: string
  header?: ReactNode
  children: ReactNode
  footer?: ReactNode
}

const FormLayout = ({
  children,
  footer,
  header,
  className,
  footerClassName,
  headerClassName,
}: FormLayoutProps) => {
  return (
    <div
      className={cn(
        "rounded-lg border-border border bg-background w-full h-full grid grid-rows-[auto_60px]",
        header && "grid-rows-[auto_auto_60px]"
      )}
    >
      {header && (
        <div className={cn("px-4 py-2 border-b flex items-center justify-end", headerClassName)}>
          {header}
        </div>
      )}
      <div className={cn("p-6 h-full grid grid-cols-2 overflow-y-scroll gap-4", className)}>
        {children}
      </div>
      <div className={cn("px-4 border-t flex items-center justify-end gap-4", footerClassName)}>
        {footer}
      </div>
    </div>
  )
}

export default FormLayout
