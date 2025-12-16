"use client"

import { useCallback, useState } from "react"
import { FileUploader } from "@/form/branding-content/components/file-uploader"

type FileRejection = { file: File; reason: string }

interface BrandAssetUploaderProps {
  label: string
  field: "logo_file" | "team_photos"
  multiple: boolean
  value: File | File[] | null
  onChange: (file: File | File[] | null, field: "logo_file" | "team_photos") => void
  maxFiles?: number
}

function BrandAssetUploader({
  label,
  field,
  multiple,
  value,
  onChange,
  maxFiles = multiple ? 10 : 1,
}: BrandAssetUploaderProps) {
  const [rejections, setRejections] = useState<FileRejection[]>([])

  const files: File[] = Array.isArray(value) ? value : value instanceof File ? [value] : []

  const handleFileChange = useCallback(
    (newFiles: File[]) => {
      if (!multiple) {
        onChange(newFiles.length > 0 ? newFiles[0] : null, field)
      } else {
        onChange(newFiles, field)
      }
    },
    [multiple, onChange, field]
  )

  return (
    <div className="flex flex-col gap-2">
      <FileUploader
        accept={["image/*", ".png", ".jpg", ".jpeg", ".svg", ".webp"]}
        multiple={multiple}
        maxFiles={maxFiles}
        maxSize={8 * 1024 * 1024}
        value={files}
        onChange={handleFileChange}
        onReject={setRejections}
        label={label}
      />
      {rejections.length > 0 && (
        <div className="rounded border p-3 bg-destructive/10 border-destructive w-full">
          <p className="text-sm text-destructive font-semibold">
            {rejections.length} file(s) were rejected:
          </p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            {rejections.map((r, idx) => (
              <li key={`${r.file.name}-${idx}`} className="text-sm text-destructive/80">
                <span>{r.file.name}</span>
                {" — "}
                <span className="font-medium">{r.reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default BrandAssetUploader
