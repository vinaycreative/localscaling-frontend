"use client";

import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BrandingContentFormData,
  IntroductoryVideoOption,
  OnboardingVideoProps,
  TeamMember,
} from "@/interfaces/onboarding/branding-content";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { OnboardingHeader } from "../business-information/page";
import BrandAssetUploader from "./components/brand-asset-uploader";
import ColorPickerInput from "./components/color-picker";
import { TeamMemberList } from "./components/member-entry-list";
import { VideoUpload } from "./components/video-upload";

const initialFormData: BrandingContentFormData = {
  fontLink: "",
  primaryBrandColor: "#007BFF",
  secondaryBrandColor: "#6C757D",
  logoFile: null,
  teamPhotos: null,
  teamMembers: [{ name: "", position: "" }],
  videoCreationOption: "upload",
  ceoVideo: null,
  videoTestimonial: null,
};

const OnboardingVideo = ({ step }: OnboardingVideoProps) => {
  return (
    <div className="flex flex-col gap-4 ">
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
  const [formData, setFormData] =
    useState<BrandingContentFormData>(initialFormData);
  const [introVideoOption, setIntroVideoOption] =
    useState<IntroductoryVideoOption>("upload");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 3;

  const handleTeamMembersChange = (nextMembers: TeamMember[]) => {
    setFormData((prevData) => ({
      ...prevData,
      teamMembers: nextMembers,
    }));
  };

  const handleColorChange = (
    field: keyof BrandingContentFormData,
    hex: string
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: hex,
    }));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    console.log("Form Data Submitted:", formData);
    setIsSubmitting(false);
    router.push("/tasks/website-setup");
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prevStep) => prevStep - 1);
    } else {
      router.back();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleFileUpload = (
    file: File | File[] | null,
    field: "logoFile" | "teamPhotos" | "ceoVideo" | "videoTestimonial"
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: file,
    }));

    if (field === "ceoVideo" && file) {
      setIntroVideoOption("upload");
      setFormData((prevData) => ({
        ...prevData,
        videoCreationOption: "upload",
      }));
    }
  };

  return (
    <div className="flex flex-col gap-4 min-h-screen">
      <SiteHeader>
        <OnboardingHeader />
      </SiteHeader>

      <div className="flex flex-col">
        <h2 className="text-balance text-3xl font-bold">Onboarding Setup</h2>
        <p className="text-pretty text-muted-foreground">
          Complete the required steps to ensure a smooth and successful project
          launch.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <OnboardingVideo step={currentStep} />

        <div className="space-y-4 lg:col-span-2 bg-background p-4 rounded">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="text-xl font-semibold">Brand Identity</h3>
                <p className="text-sm text-muted-foreground">
                  Set up your brand colors, fonts, and logo
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fontLink">
                  Font Link<span className="text-primary">*</span>
                </Label>
                <div className="flex">
                  <div className="flex bg-muted items-center px-3 border border-r-0 rounded-l">
                    <span className="text-sm text-muted-foreground">
                      https://
                    </span>
                  </div>
                  <Input
                    id="fontLink"
                    value={formData.fontLink}
                    onChange={handleChange}
                    placeholder="www.fontlink.com"
                    className="bg-background rounded rounded-l-none focus-visible:ring-[0px]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Brand Colors (Hex Code)</Label>
                <div className="flex flex-col gap-2">
                  <div>
                    <ColorPickerInput
                      value={formData.primaryBrandColor}
                      onChange={(hex) =>
                        handleColorChange("primaryBrandColor", hex)
                      }
                    />
                  </div>
                  <div>
                    <ColorPickerInput
                      value={formData.secondaryBrandColor}
                      onChange={(hex) =>
                        handleColorChange("secondaryBrandColor", hex)
                      }
                    />
                  </div>
                </div>
              </div>
              <BrandAssetUploader
                label="Company Logo"
                field="logoFile"
                multiple={false}
                value={formData.logoFile}
                onChange={handleFileUpload}
                maxFiles={1}
              />

              <BrandAssetUploader
                label="Team Photos (Portrait in corporate shirt)"
                field="teamPhotos"
                multiple={true}
                value={formData.teamPhotos}
                onChange={handleFileUpload}
                maxFiles={6}
              />
              <div className="space-y-2 mb-32">
                <TeamMemberList
                  label="Team Members"
                  value={formData.teamMembers}
                  onChange={handleTeamMembersChange}
                  addButtonLabel="Add Team Member"
                  minRows={1}
                  required={true}
                  className="mt-4"
                />
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
                <Label>
                  CEO introductory video <span className="text-primary">*</span>
                </Label>

                <VideoUpload
                  value={formData.ceoVideo}
                  onChange={(file) => handleFileUpload(file, "ceoVideo")}
                />
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
                    onClick={() => {
                      setIntroVideoOption("studio");
                      setFormData((prev) => ({
                        ...prev,
                        videoCreationOption: "studio",
                      }));
                    }}
                    className={`rounded cursor-pointer transition-all duration-300 w-fit justify-start ${
                      introVideoOption === "studio" &&
                      "ring-2 ring-primary border-primary bg-accent/20"
                    }`}
                    disabled={!!formData.ceoVideo}
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
                    onClick={() => {
                      setIntroVideoOption("remote");
                      setFormData((prev) => ({
                        ...prev,
                        videoCreationOption: "remote",
                      }));
                    }}
                    className={`rounded cursor-pointer transition-all duration-300 w-fit justify-start ${
                      introVideoOption === "remote" &&
                      "ring-2 ring-primary border-primary bg-accent/20"
                    }`}
                    disabled={!!formData.ceoVideo}
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

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="mb-4">
                <p className="text-muted-foreground italic text-xs">
                  Please watch the entire video, before proceeding with the
                  form.
                </p>
              </div>

              <div className="space-y-2">
                <Label>
                  Video testimonials <span className="text-primary">*</span>
                </Label>

                <VideoUpload
                  value={formData.videoTestimonial}
                  onChange={(file) =>
                    handleFileUpload(file, "videoTestimonial")
                  }
                />
              </div>
            </div>
          )}

          <div className="flex p-2 pt-4 gap-2 justify-end border-t">
            <Button
              variant="outline"
              className="rounded bg-transparent cursor-pointer group"
              onClick={handlePrevious}
            >
              <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-all duration-300" />
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button
                className="rounded bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer group"
                onClick={handleNext}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-all duration-300" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="rounded bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer group"
                disabled={isSubmitting}
              >
                Submit
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-all duration-300" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrandingContentPage;
