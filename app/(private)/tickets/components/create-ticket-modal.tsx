// components/tickets/CreateTicketModal.tsx
import * as React from "react"
import { useState, useEffect } from "react"
import { FieldValues, useForm, UseFormReturn } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog"
import { Info, Trash2, File as FileIcon, CloudUpload } from "lucide-react"
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
} from "@/components/ui/file-upload"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { CreateTicketValues } from "@/types/support"

export interface CreateTicketModalProps<TValues extends FieldValues = CreateTicketValues> {
  open: boolean
  onOpenChange: (open: boolean) => void
  form: UseFormReturn<TValues>
  onSubmit: (values: TValues) => Promise<void> | void
  categories?: { label: string; value: string }[]
  priorities?: { label: string; value: "low" | "medium" | "high" }[]
  maxImageResolutionHint?: string
}

const LS_KEY_SKIP_CONFIRM = "create-ticket.skipConfirm"

export function CreateTicketModal({
  open,
  form,
  onOpenChange,
  onSubmit,
  categories = [
    { label: "Website", value: "website" },
    { label: "Ads", value: "Ads" },
    { label: "Billing", value: "billing" },
    { label: "Account", value: "account" },
    { label: "Other", value: "other" },
  ],
  priorities = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
  ],
}: CreateTicketModalProps) {
  const { watch, setValue } = form
  const [files, setFiles] = React.useState<File[]>(form?.getValues("files") || [])
  const [submitting, setSubmitting] = useState(false)

  // confirmation state
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const [skipConfirm, setSkipConfirm] = useState(false)

  useEffect(() => {
    try {
      setSkipConfirm(localStorage.getItem(LS_KEY_SKIP_CONFIRM) === "1")
    } catch {}
  }, [])

  // 1) User presses submit → validate → show confirm (unless skipped)
  const requestSubmit = async (values: CreateTicketValues) => {
    console.log("🚀 ~ requestSubmit ~ values:", values)
    if (skipConfirm) {
      return actuallySubmit(values)
    }
    setConfirmOpen(true)
  }

  // 2) Confirm dialog → proceed
  const actuallySubmit = async (values: CreateTicketValues) => {
    setSubmitting(true)
    try {
      if (dontShowAgain) {
        try {
          localStorage.setItem(LS_KEY_SKIP_CONFIRM, "1")
        } catch {}
        setSkipConfirm(true)
      }
      const payload: CreateTicketValues = { ...values, files: files }
      await onSubmit(payload)
      onOpenChange(false)
      setFiles([])
      setValue("files", [])
      form.reset()
    } finally {
      setSubmitting(false)
      setConfirmOpen(false)
      setDontShowAgain(false)
    }
  }

  const onFileValidate = React.useCallback(
    (file: File): string | null => {
      // // Validate max files
      // if (files.length >= 2) {
      //   return "You can only upload up to 2 files"
      // }

      // // Validate file type (only images)
      // if (!file.type.startsWith("image/")) {
      //   return "Only image files are allowed"
      // }

      // // Validate file size (max 2MB)
      // const MAX_SIZE = 2 * 1024 * 1024 // 2MB
      // if (file.size > MAX_SIZE) {
      //   return `File size must be less than ${MAX_SIZE / (1024 * 1024)}MB`
      // }

      return null
    },
    [files]
  )

  const onUpload = React.useCallback(
    async (
      files: File[],
      {
        onProgress,
        onSuccess,
        onError,
      }: {
        onProgress: (file: File, progress: number) => void
        onSuccess: (file: File) => void
        onError: (file: File, error: Error) => void
      }
    ) => {
      try {
        // Process each file individually
        const uploadPromises = files.map(async (file) => {
          try {
            // Simulate file upload with progress
            const totalChunks = 10
            let uploadedChunks = 0

            // Simulate chunk upload with delays
            for (let i = 0; i < totalChunks; i++) {
              // Simulate network delay (100-300ms per chunk)
              await new Promise((resolve) => setTimeout(resolve, Math.random() * 200 + 100))

              // Update progress for this specific file
              uploadedChunks++
              const progress = (uploadedChunks / totalChunks) * 100
              onProgress(file, progress)
            }

            // Simulate server processing delay
            await new Promise((resolve) => setTimeout(resolve, 500))
            onSuccess(file)
            const prevFiles = watch("files") || []
            setValue("files", [...prevFiles, file])
          } catch (error) {
            onError(file, error instanceof Error ? error : new Error("Upload failed"))
          }
        })

        // Wait for all uploads to complete
        await Promise.all(uploadPromises)
      } catch (error) {
        // This handles any error that might occur outside the individual upload processes
        console.error("Unexpected error during upload:", error)
      }
    },
    []
  )

  const onFileReject = React.useCallback((file: File, message: string) => {
    // toast(message, {
    //   description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    // });
  }, [])

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!submitting) onOpenChange(v)
        }}
      >
        <div className="px-6 pb-6 space-y-5">
          <DialogContent className="sm:max-w-[590px] p-0 ">
            <DialogHeader className="px-6 pt-6">
              <DialogTitle>Create Ticket</DialogTitle>
              <DialogDescription>Tell us what’s going on so we can help quickly.</DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(requestSubmit)}>
                <ScrollArea className="h-[450px] w-full">
                  <div className="px-6 py-6 space-y-5">
                    {/* Title */}
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title of your ticket</FormLabel>
                          <FormControl>
                            <Input placeholder="What is your title?" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Category + Priority */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <Select value={field.value} onValueChange={(v) => field.onChange(v)}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map((c: { label: string; value: string }) => (
                                    <SelectItem key={c?.value} value={c?.value}>
                                      {c?.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={(v: "low" | "medium" | "high") => field.onChange(v)}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Low, Medium, High" />
                                </SelectTrigger>
                                <SelectContent>
                                  {priorities.map((p: { label: string; value: string }) => (
                                    <SelectItem key={p.value} value={p.value}>
                                      {p.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2">
                            <FormLabel>Please tell us about your issue</FormLabel>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  Be specific: what happened, where, expected vs actual, and steps
                                  to reproduce.
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <FormControl>
                            <Textarea
                              placeholder="e.g. I joined Stripe's Customer Success team to help them scale..."
                              className="min-h-[110px] resize-y"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Uploader */}
                    <div className="space-y-3">
                      <Label>Attachments</Label>
                      <FileUpload
                        value={files}
                        onValueChange={setFiles}
                        onFileValidate={onFileValidate}
                        onFileReject={onFileReject}
                        className="w-full"
                        multiple
                        onUpload={onUpload}
                      >
                        <FileUploadDropzone>
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center justify-center rounded-sm border p-2.5">
                              <CloudUpload />
                            </div>
                            <p className="font-medium text-sm text-primary">
                              Click to Upload
                              <span className="text-muted-foreground font-normal">
                                {" "}
                                or drag & drop
                              </span>
                            </p>
                            <p className="text-muted-foreground text-xs ">
                              SVG, PNG, JPG or GIF (max. 800x400px)
                            </p>
                          </div>
                        </FileUploadDropzone>
                        <FileUploadList>
                          {files.map((file) => {
                            return (
                              <FileUploadItem key={file.name} value={file} className="relative">
                                <div className="w-full">
                                  <div className="flex gap-2">
                                    <FileUploadItemPreview />
                                    <div className="w-full">
                                      <FileUploadItemMetadata />
                                      <FileUploadItemProgress />
                                    </div>
                                  </div>
                                </div>

                                <FileUploadItemDelete asChild className="absolute top-2 right-2">
                                  <Button variant="ghost" size="icon" className="size-7">
                                    <Trash2 className="text-muted-foreground" />
                                  </Button>
                                </FileUploadItemDelete>
                              </FileUploadItem>
                            )
                          })}
                        </FileUploadList>
                      </FileUpload>
                    </div>
                  </div>
                </ScrollArea>

                <DialogFooter className="p-6 py-3 pb-6">
                  {/* Footer */}
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => onOpenChange(false)}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="w-full sm:w-auto z-10" disabled={submitting}>
                      {submitting ? "Submitting..." : "Submit ticket"}
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </div>
        {/* </form>
        </Form> */}
      </Dialog>

      {/* CONFIRMATION MODAL */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="sm:max-w-[520px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-sm">Confirm ticket submission</AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              Please review details before submitting. Once submitted, you won’t be able to make
              changes.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex-col xs:flex-row sm:justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                id="dont-show-again"
                checked={dontShowAgain}
                onCheckedChange={(v) => setDontShowAgain(!!v)}
              />
              <Label htmlFor="dont-show-again" className="text-xs text-muted-foreground">
                Don’t show again
              </Label>
            </div>
            <div>
              <AlertDialogCancel className="mr-2">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={form.handleSubmit(actuallySubmit)}
                className="bg-primary text-primary-foreground"
              >
                Submit ticket
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}