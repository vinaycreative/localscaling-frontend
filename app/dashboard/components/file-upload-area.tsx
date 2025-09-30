"use client";

import { Label } from "@/components/ui/label";
import { useRef, type ReactNode } from "react";
import {
  type FieldError,
  type FieldValues,
  type Path,
  type UseFormRegister,
  type UseFormSetValue,
  type UseFormTrigger,
  type UseFormWatch,
} from "react-hook-form";

type FormGenerics<T extends FieldValues> = {
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  watch: UseFormWatch<T>;
  trigger: UseFormTrigger<T>;
  error?: FieldError;
  name: Path<T>;
};

interface FileUploadAreaProps<T extends FieldValues> {
  label: string;
  placeholder: string;
  accept: string;
  multiple?: boolean;
  formProps: FormGenerics<T>;
}

export const FileUploadArea = <T extends FieldValues>({
  label,
  placeholder,
  accept,
  multiple = false,
  formProps,
}: FileUploadAreaProps<T>): ReactNode => {
  const { register, setValue, watch, trigger, error, name } = formProps;

  const fileValue = watch(name) as string | undefined;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    let fileName = "";
    if (files && files.length > 0) {
      if (multiple) {
        fileName = Array.from(files)
          .map((file) => file.name)
          .join(", ");
      } else {
        fileName = files[0].name;
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue(name, fileName as any, { shouldValidate: true });
    trigger(name);
  };

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  const fileNameDisplay = fileValue || "";
  const errorMessage = error?.message;

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-muted-foreground">
        {label}
        {"*"}
      </Label>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          errorMessage
            ? "border-red-500/50"
            : "border-muted-foreground/25 hover:border-primary/50"
        }`}
        onClick={handleAreaClick}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <svg
              className="w-4 h-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <div className="text-sm">
            <span className="text-primary cursor-pointer hover:underline">
              {fileNameDisplay ? "Change file" : "Click to upload"}
            </span>
            <span className="text-muted-foreground"> or drag and drop</span>
          </div>
          {fileNameDisplay ? (
            <p className="text-sm font-medium text-foreground">
              {fileNameDisplay}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">{placeholder}</p>
          )}

          <input
            type="file"
            id={name}
            name={name}
            accept={accept}
            multiple={multiple}
            className="sr-only"
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          <input type="hidden" {...register(name)} />
        </div>
      </div>
      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
};
