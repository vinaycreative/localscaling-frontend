"use client";

import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandingFormData, BrandingSchema } from "@/schema/branding-content";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type React from "react";
import { useRef } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

interface FileUploadAreaProps {
  label: string;
  name: keyof BrandingFormData;
  accept: string;
  placeholder: string;
  error?: string;
  multiple?: boolean;
  register: ReturnType<typeof useForm<BrandingFormData>>["register"];
  setValue: ReturnType<typeof useForm<BrandingFormData>>["setValue"];
  watch: ReturnType<typeof useForm<BrandingFormData>>["watch"];
  trigger: ReturnType<typeof useForm<BrandingFormData>>["trigger"];
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  label,
  name,
  accept,
  placeholder,
  error,
  multiple = false,
  register,
  setValue,
  watch,
  trigger,
}) => {
  const fileValue = watch(name);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      if (multiple) {
        setValue(
          name,
          Array.from(files)
            .map((file) => file.name)
            .join(", ")
        );
      } else {
        setValue(name, files[0].name);
      }
    } else {
      setValue(name, "");
    }
    trigger(name);
  };

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  const fileNameDisplay = fileValue || "";

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-muted-foreground">
        {label}
        {"*"}
      </Label>
      <div
        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
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
          {/* Hidden input to hold the file name for validation */}
          <input type="hidden" {...register(name)} />
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

const OnboardingHeader = () => (
  <div className="flex flex-col gap-4">
    <div className="flex gap-2 text-primary items-center cursor-pointer">
      <ArrowLeft className="h-3 w-3" />
      Dashboard
    </div>
  </div>
);

const OnboardingVideo = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-0">
        <h1 className="font-semibold text-foreground">2. Branding & Content</h1>
        <p className="text-sm text-muted-foreground">
          Submit brand assets for a consistent identity.
        </p>
      </div>

      <div className="relative aspect-video bg-muted rounded overflow-hidden">
        <Image
          src="/video.jpg"
          alt="Branding consultation video"
          className="w-full h-full object-cover"
          width={300}
          height={300}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-primary/80 rounded-full flex items-center justify-center">
            <div className="w-0 h-0 border-l-[12px] border-l-primary-foreground border-y-[8px] border-y-transparent ml-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

function BrandingContentPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    trigger,
  } = useForm<BrandingFormData>({
    resolver: zodResolver(BrandingSchema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<BrandingFormData> = (data) => {
    console.log("Form Data Submitted:", data);
    router.push("/dashboard/website-setup");
  };

  const handlePrevious = (): void => {
    router.push("/dashboard/business-information");
  };

  return (
    <div className="flex flex-col gap-4 min-h-screen">
      <SiteHeader>
        <OnboardingHeader />
      </SiteHeader>

      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold">Onboarding Setup</h2>
        <p className="text-muted-foreground">
          Complete the required steps to ensure a smooth and successful project
          launch
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid lg:grid-cols-3 gap-8"
      >
        <OnboardingVideo />

        <div className="space-y-6 lg:col-span-2 bg-background p-4 rounded">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fontLink" className="text-muted-foreground">
                Font Link*
              </Label>
              <div className="flex">
                <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
                  <span className="text-sm text-muted-foreground">
                    https://
                  </span>
                </div>
                <Input
                  id="fontLink"
                  placeholder="www.fontlink.com"
                  className={`rounded-l-none bg-background ${
                    errors.fontLink ? "border-red-500" : ""
                  }`}
                  {...register("fontLink")}
                />
              </div>
              {errors.fontLink && (
                <p className="text-sm text-red-500">
                  {errors.fontLink.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brandColor" className="text-muted-foreground">
                Brand Colors*
              </Label>
              <Input
                id="brandColors"
                placeholder="e.g., #FF6B6B, #4ECDC4, #45B7D1"
                className={`bg-background ${
                  errors.brandColor ? "border-red-500" : ""
                }`}
                {...register("brandColor")}
              />
              {errors.brandColor && (
                <p className="text-sm text-red-500">
                  {errors.brandColor.message}
                </p>
              )}
            </div>

            <FileUploadArea
              label="Company logo"
              name="logo"
              accept="image/*"
              placeholder="SVG, PNG, JPG or GIF (max. 800x400px)"
              error={errors.logo?.message}
              register={register}
              setValue={setValue}
              watch={watch}
              trigger={trigger}
            />

            <FileUploadArea
              label="Team photos (min. 5)"
              name="teamPhotos"
              accept="image/*"
              placeholder="SVG, PNG, JPG or GIF (max. 800x400px)"
              error={errors.teamPhotos?.message}
              multiple
              register={register}
              setValue={setValue}
              watch={watch}
              trigger={trigger}
            />

            <FileUploadArea
              label="CEO introductory video"
              name="introVideo"
              accept="video/*"
              placeholder="MP4, MOV or URL (YouTube/Vimeo/Drive link)"
              error={errors.introVideo?.message}
              register={register}
              setValue={setValue}
              watch={watch}
              trigger={trigger}
            />

            <FileUploadArea
              label="Video testimonials"
              name="videoTestimonial"
              accept="video/*"
              placeholder="MP4, MOV or URL (YouTube/Vimeo/Drive link)"
              error={errors.videoTestimonial?.message}
              multiple
              register={register}
              setValue={setValue}
              watch={watch}
              trigger={trigger}
            />
          </div>

          <div className="flex p-2 pt-4 gap-2 justify-end border-t">
            <Button
              type="button"
              variant="outline"
              className="rounded bg-transparent cursor-pointer"
              onClick={handlePrevious}
            >
              Previous
            </Button>
            <Button
              type="submit"
              className="rounded bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
              disabled={isSubmitting}
            >
              Next
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default BrandingContentPage;
