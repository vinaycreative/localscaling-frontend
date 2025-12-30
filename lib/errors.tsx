import { FieldErrors } from "react-hook-form"
import { toast } from "sonner"

export function extractFormErrors(
  errors: FieldErrors,
  parentKey = ""
): { path: string; message: string }[] {
  return Object.entries(errors).flatMap(([key, value]) => {
    const path = parentKey ? `${parentKey}.${key}` : key

    if (!value) return []

    // Single field error
    if ("message" in value && value.message) {
      return [{ path, message: String(value.message) }]
    }

    // Nested object or array
    if (typeof value === "object") {
      return extractFormErrors(value as FieldErrors, path)
    }

    return []
  })
}

export const showFormErrors = (errors: FieldErrors) => {
  const displayErrors = extractFormErrors(errors)

  if (displayErrors.length === 0) return

  toast.error("Please fill all required fields correctly", {
    description: (
      <div className="flex flex-col gap-1">
        {displayErrors.map(({ path, message }) => (
          <div key={path} className="text-xs">
            <span className="capitalize font-medium">
              {path.replace(/\./g, " → ").replace(/_/g, " ")}
            </span>
            : {message}
          </div>
        ))}
      </div>
    ),
  })
}
