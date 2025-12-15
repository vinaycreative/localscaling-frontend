import { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReactNode } from "react"

interface SectionCardProps {
  title: string
  icon: LucideIcon
  children: ReactNode
}

export const SectionCard = ({ title, icon: Icon, children }: SectionCardProps) => {
  return (
    <Card className="rounded-sm gap-4 shadow-none border border-gray-200">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center gap-2 text-base font-semibold mb-0">
          <Icon className="w-5 h-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  )
}
