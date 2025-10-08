"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import React from "react";

type TagInputProps = {
  label: string;
  placeholder?: string;
  values: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
  required?: boolean;
  description?: string;
  error?: string;
};

export function TagInput({
  label,
  placeholder,
  values,
  onAdd,
  onRemove,
  required,
  description,
  error,
}: TagInputProps) {
  const [val, setVal] = React.useState("");

  const handleAdd = () => {
    const trimmed = val.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setVal("");
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-muted-foreground">
        {label} {required ? "*" : null}
      </Label>

      <div className="flex gap-2">
        <Input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="bg-background"
        />
        <Button
          type="button"
          variant="outline"
          className="rounded bg-transparent"
          onClick={handleAdd}
        >
          Add <Plus className="w-3.5 h-3.5 ml-2" />
        </Button>
      </div>

      {description ? (
        <p className="text-xs text-muted-foreground">{description}</p>
      ) : null}

      {values?.length ? (
        <div className="flex flex-wrap gap-2 pt-1">
          {values.map((tag, idx) => (
            <span
              key={`${tag}-${idx}`}
              className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs bg-secondary text-secondary-foreground"
            >
              {tag}
              <button
                type="button"
                aria-label={`Remove ${tag}`}
                onClick={() => onRemove(idx)}
                className="ml-1 hover:opacity-80"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      ) : null}

      {error ? (
        <p role="alert" aria-live="polite" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
