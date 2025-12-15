import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { FormLabel, useFormField } from "../ui/form"

type SelectOption = {
  value: string
  label: string
}

export const CustomInput = ({
  label,
  id,
  type,
  placeholder,
  required,
  className,
  value,
  onChange,
  select = false,
  selectOptions = [],
  onSelectChange,
  PrefixIcon,
  SuffixIcon,
  prefixText,
}: {
  label: string
  id: string
  type?: string
  placeholder: string
  required: boolean
  className?: string
  value: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  select?: boolean
  selectOptions?: SelectOption[]
  onSelectChange?: (value: string) => void
  PrefixIcon?: LucideIcon
  SuffixIcon?: LucideIcon
  prefixText?: string
}) => {
  return (
    <div className={cn("space-y-2.5", className)}>
      <Label htmlFor={id}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>

      {select ? (
        <Select onValueChange={onSelectChange} value={value} defaultValue={value ?? null}>
          <div
            className={cn(
              "flex w-full overflow-hidden border border-input rounded bg-background transition-all duration-200",
              "hover:border-primary/50",
              "focus-within:border-primary"
            )}
          >
            <SelectTrigger
              id={id}
              className={cn(
                "w-full bg-transparent border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0",
                "h-9.5 px-3 py-1 rounded-none"
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
          </div>

          <SelectContent className="cursor-pointer rounded">
            {selectOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="cursor-pointer transition-all duration-300 rounded"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div
          className={cn(
            "flex w-full gap-2 overflow-hidden border border-input rounded bg-background transition-all duration-200",
            "hover:border-primary/50",
            "focus-within:border-primary"
          )}
        >
          {(prefixText || PrefixIcon) && (
            <div
              className={cn(
                "flex items-center pl-3 pr-2 text-sm text-muted-foreground",
                prefixText && "bg-muted/50 border-r border-input"
              )}
            >
              {PrefixIcon ? <PrefixIcon className="w-4 h-4" /> : prefixText}
            </div>
          )}
          <Input
            id={id}
            type={type}
            placeholder={placeholder}
            className={cn(
              "w-full bg-transparent border-none focus-visible:ring-0 shadow-none",
              PrefixIcon || prefixText ? "rounded-l-none pl-0" : "pl-3",
              SuffixIcon ? "rounded-r-none pr-0" : "pr-3",
              "focus-visible:ring-0 focus-visible:ring-offset-0"
            )}
            value={value}
            onChange={onChange}
          />
          {SuffixIcon && (
            <div className="flex items-center pr-3 pl-2 text-muted-foreground">
              {SuffixIcon && <SuffixIcon className="w-4 h-4" />}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
