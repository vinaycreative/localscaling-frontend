"use client"
import { CustomInput } from "@/components/reusable/custom-input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { PlusIcon, Trash } from "lucide-react"

export interface TeamMember {
  name: string
  position: string
}

type TeamMemberListProps = {
  value: TeamMember[]
  onChange: (next: TeamMember[]) => void
  required: boolean
  label?: string
  addButtonLabel?: string
  minRows?: number
  maxRows?: number
  className?: string
  errors?: any
}

export function TeamMemberList({
  value,
  onChange,
  required,
  label = "Team Members",
  addButtonLabel = "Add Team Member",
  minRows = 1,
  maxRows,
  className,
  errors,
}: TeamMemberListProps) {
  const list = value ?? []
  const emptyTeamMember: TeamMember = { name: "", position: "" }

  const canAdd = typeof maxRows === "number" ? list.length < maxRows : true
  const canDelete = () => list.length > minRows

  const handleAdd = () => {
    if (!canAdd) return
    onChange([...list, emptyTeamMember])
  }

  const handleDelete = (index: number) => {
    if (!canDelete()) return
    const next = list.filter((_, i) => i !== index)
    onChange(next)
  }

  const handleChange = (index: number, field: keyof TeamMember, nextValue: string) => {
    const next = list.map((member, i) => (i === index ? { ...member, [field]: nextValue } : member))
    onChange(next)
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-2 flex justify-between items-center w-full">
        <Label className="text-sm">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        <Button
          type="button"
          onClick={handleAdd}
          disabled={!canAdd}
          className="cursor-pointer rounded"
        >
          <PlusIcon className="mr-1" />
          {addButtonLabel}
        </Button>
      </div>

      <ul className="flex flex-col gap-4">
        {list?.map((member, idx) => (
          <li
            key={`team-member-${idx}`}
            className="flex items-start gap-4 rounded border p-4 bg-muted/30"
          >
            <div className="flex-1 grid grid-cols-2 gap-4 items-center">
              <div className="space-y-2">
                <CustomInput
                  label="Name"
                  id={`name-${idx}`}
                  type="text"
                  placeholder="e.g., Jane Doe"
                  required={required}
                  value={member.name}
                  onChange={(e) => handleChange(idx, "name", e.target.value)}
                />
                {errors?.[idx]?.name?.message && (
                  <p className={"text-destructive text-[12px]"}>{errors?.[idx]?.name?.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <CustomInput
                  label="Position"
                  id={`position-${idx}`}
                  type="text"
                  placeholder="e.g., CEO"
                  required={required}
                  value={member.position}
                  onChange={(e) => handleChange(idx, "position", e.target.value)}
                />
                {errors?.[idx]?.position?.message && (
                  <p className={"text-destructive text-[12px]"}>{errors?.[idx]?.position?.message}</p>
                )}
              </div>
            </div>

            {canDelete() && (
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDelete(idx)}
                className="cursor-pointer rounded-full h-10 w-10 p-0 flex-shrink-0 hover:bg-muted/30 transition-all duration-300"
                aria-label={`Delete Team Member ${idx + 1}`}
              >
                <Trash className="w-4 h-4" />
              </Button>
            )}
          </li>
        ))}

        {list.length === 0 && minRows === 0 ? (
          <li className="text-sm text-muted-foreground bg-muted/30 rounded-md border border-dashed border-border p-3">
            No team members added yet.
          </li>
        ) : null}
      </ul>
    </div>
  )
}
