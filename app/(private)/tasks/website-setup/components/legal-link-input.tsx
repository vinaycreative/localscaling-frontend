import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LinkIcon, Plus, X } from "lucide-react";
import { useState } from "react";

export interface LegalLinkInputProps {
  // Value is an array of URL strings
  value: string[]; // Change handler receives the updated array of links
  onChange: (newLinks: string[]) => void;
}

const LegalLinkInput = ({ value, onChange }: LegalLinkInputProps) => {
  const [newLink, setNewLink] = useState("http://");

  const addLink = () => {
    const url = newLink.trim();
    // Basic URL validation
    if (
      url &&
      (url.startsWith("http://") || url.startsWith("https://")) &&
      !value.includes(url)
    ) {
      onChange([...value, url]);
      setNewLink("http://");
    } else if (url && !url.startsWith("http")) {
      // Suggesting adding http if missing
      const suggestedUrl = `http://${url}`;
      onChange([...value, suggestedUrl]);
      setNewLink("http://");
    }
  };

  const removeLink = (linkToRemove: string) => {
    onChange(value.filter((link) => link !== linkToRemove));
  };

  return (
    <div className="space-y-4 pt-2">
      <Label>Legal Page Links (Privacy Policy, ToS, etc.)</Label>

      {/* Input and Add Button */}
      <div className="flex gap-2">
        <Input
          placeholder="e.g., http://yourdomain.com/privacy"
          value={newLink}
          onChange={(e) => setNewLink(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && (e.preventDefault(), addLink())
          }
          className="flex-grow"
        />
        <Button
          type="button"
          onClick={addLink}
          variant="secondary"
          className="flex-shrink-0"
        >
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
      </div>

      {/* Link List */}
      {value.length > 0 && (
        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
          {value.map((link, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded text-sm transition-all hover:shadow-md"
            >
              <span className="flex items-center gap-2 truncate max-w-[85%] text-blue-600">
                <LinkIcon className="h-4 w-4 flex-shrink-0" />
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate hover:underline"
                >
                  {link}
                </a>
              </span>
              <button
                type="button"
                onClick={() => removeLink(link)}
                className="transition-colors flex-shrink-0 ml-2"
                title="Remove link"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-muted-foreground mt-[2px]">
        Enter the full URL of your legal pages (Privacy Policy, Terms of
        Service, etc.) and click Add.
      </p>
    </div>
  );
};

export default LegalLinkInput;
