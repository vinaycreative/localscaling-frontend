"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useId, useState, type KeyboardEvent } from "react";

type Props = {
  id?: string;
  defaultValues?: string[];
  placeholder?: string;
};

export function TagMultiInput({ id, defaultValues = [], placeholder }: Props) {
  const reactId = useId();
  const inputId = id || reactId;
  const [tags, setTags] = useState<string[]>(defaultValues);
  const [value, setValue] = useState("");

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && value.trim()) {
      e.preventDefault();
      const next = value.trim();
      if (!tags.includes(next)) setTags((t) => [...t, next]);
      setValue("");
    } else if (e.key === "Backspace" && !value && tags.length) {
      setTags((t) => t.slice(0, -1));
    }
  };

  const remove = (item: string) => {
    setTags((t) => t.filter((v) => v !== item));
  };

  return (
    <div
      className="flex min-h-10 w-full flex-wrap items-center gap-2 rounded-md border bg-background px-3 py-2"
      role="listbox"
      aria-labelledby={`${inputId}-label`}
    >
      {tags.map((t) => (
        <Badge key={t} variant="secondary" className="flex items-center gap-1">
          {t}
          <button
            type="button"
            onClick={() => remove(t)}
            aria-label={`Remove ${t}`}
            className="ml-1"
          >
            <X className="size-3" />
          </button>
        </Badge>
      ))}
      <Input
        id={inputId}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="h-6 flex-1 border-0 p-0 shadow-none focus-visible:ring-0"
      />
    </div>
  );
}
