"use client";

import {
  useController,
  type FieldValues,
  type Path,
  type PathValue,
  type UseControllerProps,
} from "react-hook-form";
import ErrorMessage from "./error-message";
import { FileUploader, FileUploaderProps } from "./file-uploader";

type FileListValue = FileList | File[] | undefined | null;

type FileUploaderFieldType<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> = PathValue<TFieldValues, TName>;

interface FormFileUploaderProps<T extends FieldValues>
  extends Omit<FileUploaderProps, "value" | "onChange" | "multiple">,
    Omit<UseControllerProps<T>, "name" | "defaultValue"> {
  name: Path<T>;
  multiple?: boolean;
  defaultValue?: FileUploaderFieldType<T, Path<T>> | FileListValue;
}

export function FormFileUploader<T extends FieldValues>({
  name,
  control,
  shouldUnregister,
  defaultValue,
  multiple = false,
  ...fileUploaderProps
}: FormFileUploaderProps<T>) {
  const {
    field: { onBlur, value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
    shouldUnregister,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValue: defaultValue ?? ((multiple ? [] : undefined) as any),
  });

  const filesArray: File[] =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (value as any) instanceof FileList
      ? Array.from(value)
      : Array.isArray(value)
        ? value
        : [];

  const handleFileChange = (files: File[]) => {
    const nextValue = multiple
      ? files
      : files.length > 0
        ? files[0]
        : undefined;
    onChange(nextValue);
  };

  return (
    <div onBlur={onBlur}>
      <FileUploader
        {...fileUploaderProps}
        multiple={multiple}
        value={multiple ? filesArray : filesArray.slice(0, 1)}
        onChange={handleFileChange}
      />
      <ErrorMessage message={error?.message} />
    </div>
  );
}
