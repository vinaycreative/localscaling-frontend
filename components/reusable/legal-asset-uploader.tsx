import { useCallback, useState } from "react"
import {
  FileRejection,
  FileUploader,
} from "../../app/(private)/(client)/tasks/branding-content/components/file-uploader"

export interface LegalAssetUploaderProps {
  label: string
  multiple: boolean
  value: File[] | null
  onChange: (newFiles: File[]) => void
  maxFiles?: number
}

function LegalAssetUploader({
  label,
  multiple,
  value,
  onChange,
  maxFiles = multiple ? 10 : 1,
}: LegalAssetUploaderProps) {
  const [rejections, setRejections] = useState<FileRejection[]>([])

  const files = value ? value : []
  const handleFileChange = useCallback(
    (newFiles: File[]) => {
      if (!multiple) {
        onChange([newFiles[0]])
      } else {
        onChange(newFiles.filter(Boolean))
      }
    },
    [multiple, onChange]
  )

  return (
    <div className="flex flex-col gap-2">
      <FileUploader
        accept={[".pdf", ".docx", ".doc", ".txt", "image/*"]}
        multiple={multiple}
        maxFiles={maxFiles}
        maxSize={10 * 1024 * 1024}
        value={files}
        onChange={handleFileChange}
        onReject={setRejections}
        label={label}
      />
      {rejections.length > 0 && (
        <div className="rounded border p-3 w-full">
          <p className="text-sm font-semibold">{rejections.length} file(s) were rejected:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            {rejections.map((r, idx) => (
              <li key={`${r.file.name}-${idx}`} className="text-sm">
                <span>{r.file.name}</span>
                {" — "}
                <span>{r.reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default LegalAssetUploader
