"use client";

import { useState } from "react";
import { FileUploader } from "./file-uploader";

export function FormFileUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [rejections, setRejections] = useState<
    { file: File; reason: string }[]
  >([]);

  return (
    <div className="flex flex-col gap-4">
      <FileUploader
        label="Images"
        description="Drag and drop images here, or click to browse."
        accept={["image/*", ".png", ".jpg", ".jpeg", ".gif", ".webp"]}
        multiple
        maxFiles={6}
        maxSize={8 * 1024 * 1024}
        value={files}
        onChange={setFiles}
        onReject={(r) => setRejections(r)}
      />
      {rejections.length > 0 && (
        <div className="rounded border p-3 bg-muted/20 w-full">
          <p className="text-sm">Some files were rejected:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            {rejections.map((r, idx) => (
              <li
                key={`${r.file.name}-${idx}`}
                className="text-sm text-muted-foreground"
              >
                <span>{r.file.name}</span>
                {" — "}
                {r.reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
