import { Button } from "@/components/ui/button"
import { LinkIcon, Plus, X } from "lucide-react"
import { useState } from "react"
import { CustomInput } from "./custom-input"

export interface LegalLinkInputProps {
  value: string[]
  onChange: (newLinks: string[]) => void
  errors: any
}

const LegalLinkInput = ({ value, onChange, errors }: LegalLinkInputProps) => {
  const [newLink, setNewLink] = useState("")

  const addLink = () => {
    const url = newLink.trim()
    if (!url) return // Prevent adding empty values
    if (value.includes(url)) return // Prevent duplicates
    const fullUrl = url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`
    onChange([...value, fullUrl])
  }

  const removeLink = (linkToRemove: string) => {
    onChange(value.filter((link) => link !== linkToRemove))
  }

  console.log("value is ", value)

  return (
    <div className="space-y-4 pt-2">
      <div className="flex gap-2">
        <CustomInput
          label="Legal Link"
          id="fontLink"
          placeholder="example.com/legal-page"
          required={false}
          value={newLink}
          onChange={(e) => setNewLink(e.target.value)}
          prefixText="https://"
          className="w-full [&>label]:hidden space-y-0"
        />
        <Button
          type="button"
          onClick={addLink}
          variant="outline"
          className="flex-shrink-0 cursor-pointer rounded"
        >
          Add
          <Plus className="w-4 h-4 mr-1" />
        </Button>
      </div>
      {value?.length > 0 && (
        <div className="space-y-2 pr-2">
          {" "}
          {value?.map((link, index) => {
            const fullUrl =
              link.startsWith("http://") || link.startsWith("https://") ? link : `https://${link}`

            return (
              <div
                key={index}
                className="flex items-center justify-between p-1.5 px-3 border rounded text-sm transition-all hover:shadow-md"
              >
                <span className="flex items-center gap-2 truncate max-w-[85%] text-blue-600">
                  <LinkIcon className="h-4 w-4 flex-shrink-0" />{" "}
                  <a
                    href={fullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate hover:underline"
                  >
                    {link}
                  </a>
                </span>
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    removeLink(link)
                  }}
                  className="transition-colors cursor-pointer flex-shrink-0 ml-2"
                  title="Remove link"
                >
                  <X className="h-4 w-4 text-destructive" />{" "}
                </Button>{" "}
                {errors?.[index]?.message && errors?.[index]?.message}
              </div>
            )
          })}{" "}
        </div>
      )}{" "}
    </div>
  )
}
export default LegalLinkInput
