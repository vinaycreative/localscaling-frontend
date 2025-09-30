"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface BrandingFormData {
  fontLink?: string;
  brandColor?: string;
  logo?: string;
  teamPhotos?: string;
  introVideo?: string;
  videoTestimonial?: string;
}

const FileUploadArea: React.FC<{
  label: string;
  accept: string;
  placeholder: string;
  required?: boolean;
}> = ({ label, placeholder, required = false }) => {
  return (
    <div className="space-y-2">
      <Label className="text-muted-foreground">
        {label}
        {required && "*"}
      </Label>
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
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
              Click to upload
            </span>
            <span className="text-muted-foreground"> or drag and drop</span>
          </div>
          <p className="text-xs text-muted-foreground">{placeholder}</p>
        </div>
      </div>
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
  const [formData, setFormData] = useState<BrandingFormData>({});

  const handleInputChange = (
    field: keyof BrandingFormData,
    value: string
  ): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = (): void => {
    router.push("/dashboard/website-setup");
  };

  const handlePrevious = (): void => {
    router.push("/dashboard/business-information");
  };

  return (
    <div className="flex flex-col gap-4 min-h-screen">
      <OnboardingHeader />

      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold">Onboarding Setup</h2>
        <p className="text-muted-foreground">
          Complete the required steps to ensure a smooth and successful project
          launch
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
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
                  className="rounded-l-none bg-background"
                  value={formData.fontLink || ""}
                  onChange={(e) =>
                    handleInputChange("fontLink", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Brand Colors */}
            <div className="space-y-2">
              <Label htmlFor="brandColor" className="text-muted-foreground">
                Brand Colors
              </Label>
              <Input
                id="brandColors"
                placeholder="e.g., #FF6B6B, #4ECDC4, #45B7D1 (for purple, use primary)"
                className="bg-background"
                value={formData.brandColor || ""}
                onChange={(e) =>
                  handleInputChange("brandColor", e.target.value)
                }
              />
            </div>

            {/* File Upload Areas */}
            <FileUploadArea
              label="Company logo"
              accept="image/*"
              placeholder="SVG, PNG, JPG or GIF (max. 800x400px)"
              required
            />

            <FileUploadArea
              label="Team photos (min. 5)"
              accept="image/*"
              placeholder="SVG, PNG, JPG or GIF (max. 800x400px)"
              required
            />

            <FileUploadArea
              label="CEO introductory video"
              accept="video/*"
              placeholder="MP4, MOV or URL (YouTube/Vimeo/Drive link)"
              required
            />

            <FileUploadArea
              label="Video testimonials"
              accept="video/*"
              placeholder="MP4, MOV or URL (YouTube/Vimeo/Drive link)"
            />
          </div>

          <div className="flex p-2 pt-4 gap-2 justify-end border-t">
            <Button
              variant="outline"
              className="rounded bg-transparent cursor-pointer"
              onClick={handlePrevious}
            >
              Previous
            </Button>
            <Button
              className="rounded bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
              onClick={handleNext}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrandingContentPage;
