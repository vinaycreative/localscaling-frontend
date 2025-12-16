import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Image from "next/image"

type AccessToolFieldProps = {
  field: any
  title: string
  iconSrc: string | null
  buttonText: string
}

export const AccessToolField = ({ field, title, iconSrc, buttonText }: AccessToolFieldProps) => (
  <div className="space-y-2">
    <Label className="font-medium">{title}</Label>

    <Button
      type="button"
      variant={field.value ? "default" : "outline"}
      className="rounded px-4 cursor-pointer transition-all duration-300 flex items-center gap-3"
      onClick={() => field.onChange(!field.value)}
    >
      {iconSrc && (
        <Image
          src={iconSrc}
          alt={title}
          width={20}
          height={20}
          className="w-5 h-5 object-contain"
        />
      )}
      {buttonText}
    </Button>
  </div>
)
