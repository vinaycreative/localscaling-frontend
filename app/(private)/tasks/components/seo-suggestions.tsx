"use client";

import { Button } from "@/components/ui/button";

export function SeoSuggestions({
  suggestions,
  onPick,
}: {
  suggestions: string[];
  onPick: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((s) => (
        <Button
          key={s}
          type="button"
          variant="outline"
          className="h-7 rounded-full text-xs bg-transparent"
          onClick={() => onPick(s)}
        >
          {s}
        </Button>
      ))}
    </div>
  );
}
