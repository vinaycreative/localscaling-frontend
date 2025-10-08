"use client";

import { TagInput } from "./tag-input";

type LinkAdderProps = {
  values: string[];
  onAdd: (url: string) => void;
  onRemove: (index: number) => void;
  error?: string;
};

export function LinkAdder({ values, onAdd, onRemove, error }: LinkAdderProps) {
  return (
    <TagInput
      label="Add legal page URL"
      placeholder="http://"
      values={values}
      onAdd={onAdd}
      onRemove={onRemove}
      description="Add URLs to your privacy policy, imprint, terms, etc."
      error={error}
    />
  );
}
