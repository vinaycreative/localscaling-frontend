"use client";

import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandingFormData, BrandingSchema } from "@/schema/branding-content";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { OnboardingHeader } from "../business-information/page";
import ErrorMessage from "../components/error-message";
import { FileUploadArea } from "../components/file-upload-area";

interface OnboardingVideoProps {
  step: number;
}

const OnboardingVideo = ({ step }: OnboardingVideoProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-0">
        <h1 className="font-semibold text-foreground">
          {`2.${step} Branding & Content`}
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
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const totalSteps = 2;

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

  const handleNext = async () => {
    let fieldsToValidate: (keyof BrandingFormData)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = [
        "fontLink",
        "primaryBrandColor",
        "secondaryBrandColor",
        "logo",
      ];
    }

    const isValid = await trigger(fieldsToValidate);

    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = (): void => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push("/dashboard/business-information");
    }
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
        <OnboardingVideo step={currentStep} />

        <div className="space-y-6 lg:col-span-2 bg-background p-4 rounded">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="text-xl font-semibold">Brand Identity</h3>
                <p className="text-sm text-muted-foreground">
                  Set up your brand colors, fonts, and logo
                </p>
              </div>

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
                    <ErrorMessage
                      message={errors.secondaryBrandColor?.message}
                    />
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

              <div className="space-y-2 mb-32">
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
                    <ErrorMessage
                      message={errors.teamMemberPosition?.message}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="mb-4">
                <p className="text-muted-foreground italic text-xs">
                  Please watch the entire video, before proceeding with the
                  form.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">
                  CEO introductory video*
                </Label>

                <div className="border rounded p-8 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 rounded border flex items-center justify-center">
                      <Upload className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <button
                        type="button"
                        className="text-primary hover:underline font-medium"
                      >
                        Click to upload
                      </button>
                      <span className="text-muted-foreground">
                        {" "}
                        or drag and drop
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      MP4, MOV or URL (YouTube/Vimeo/Drive link)
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <p className="text-sm">
                  Do not have an introductory video? Choose how you&apos;d like
                  us to help you create one.
                </p>

                <div className="space-y-3">
                  <Button
                    type="button"
                    variant={"outline"}
                    onClick={() => setSelectedOption("studio")}
                    className={`rounded cursor-pointer transition-all duration-300 ${
                      selectedOption === "studio" &&
                      "border-primary bg-primary/5"
                    }`}
                  >
                    Schedule a Studio Session
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Book a slot at our studio to record your professional
                    introduction.
                  </p>

                  <div className="flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">or</span>
                  </div>

                  <Button
                    type="button"
                    variant={"outline"}
                    className={`rounded cursor-pointer transition-all duration-300 ${
                      selectedOption === "remote" &&
                      "border-primary bg-primary/5"
                    }`}
                  >
                    Record Remotely
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Schedule an online session, our team will guide you over a
                    video call and edit it for you.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
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

            {currentStep < totalSteps ? (
              <Button
                type="button"
                className="rounded bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer group"
                onClick={handleNext}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-all duration-300" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="rounded bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer group"
                disabled={isSubmitting}
              >
                Submit
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-all duration-300" />
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default BrandingContentPage;
