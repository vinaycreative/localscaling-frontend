"use client";

import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandingFormData, BrandingSchema } from "@/schema/branding-content";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { OnboardingHeader } from "../business-information/page";
import ErrorMessage from "../components/error-message";
import { FileUploadArea } from "../components/file-upload-area";

const OnboardingVideo = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-0">
        <h1 className="font-semibold text-foreground">
          2.1 Branding & Content
        </h1>
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
                <div className="flex items-center px-3 border border-r-0 rounded-l-md">
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
              <ErrorMessage message={errors.fontLink?.message} />
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">
                Brand Colors (Hex Code)
              </Label>
              <div className="flex flex-col gap-2">
                <div>
                  <Input
                    id="primaryBrandColor"
                    placeholder="e.g., #FF6B6B"
                    className="bg-background"
                    {...register("primaryBrandColor")}
                  />
                  <ErrorMessage message={errors.primaryBrandColor?.message} />
                </div>
                <div>
                  <Input
                    id="secondaryBrandColor"
                    placeholder="e.g., #4ECDC4"
                    className="bg-background"
                    {...register("secondaryBrandColor")}
                  />
                  <ErrorMessage message={errors.secondaryBrandColor?.message} />
                </div>
              </div>
            </div>

            <FileUploadArea
              label="Company logo"
              placeholder="SVG, PNG, JPG or GIF (max. 800x400px)"
              accept="image/*"
              formProps={{
                register,
                setValue,
                watch,
                trigger,
                error: errors.logo,
                name: "logo",
              }}
            />

            <FileUploadArea
              label="Team photos (Portrait in Corporate Shirt)"
              placeholder="SVG, PNG or JPG"
              accept="image/*"
              multiple
              formProps={{
                register,
                setValue,
                watch,
                trigger,
                error: errors.teamPhotos,
                name: "teamPhotos",
              }}
            />

            <div className="space-y-2">
              <Label className="text-muted-foreground">Team Members*</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="teamMemberName"
                    className="text-sm text-muted-foreground"
                  >
                    Name
                  </Label>
                  <Input
                    id="teamMemberName"
                    placeholder="Enter name"
                    className={`bg-background ${
                      errors.teamMemberName ? "border-red-500" : ""
                    }`}
                    {...register("teamMemberName")}
                  />
                  <ErrorMessage message={errors.teamMemberName?.message} />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="teamMemberPosition"
                    className="text-sm text-muted-foreground"
                  >
                    Position
                  </Label>
                  <Input
                    id="teamMemberPosition"
                    placeholder="Enter position"
                    className={`bg-background ${
                      errors.teamMemberPosition ? "border-red-500" : ""
                    }`}
                    {...register("teamMemberPosition")}
                  />
                  <ErrorMessage message={errors.teamMemberPosition?.message} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex p-2 pt-4 gap-2 justify-end border-t">
            <Button
              type="button"
              variant="outline"
              className="rounded bg-transparent cursor-pointer group"
              onClick={handlePrevious}
            >
              <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-all duration-300" />
              Previous
            </Button>
            <Button
              type="submit"
              className="rounded bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer group"
              disabled={isSubmitting}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-all duration-300" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default BrandingContentPage;
