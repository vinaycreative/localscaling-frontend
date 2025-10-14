"use client";

import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { OnboardingHeader } from "../business-information/page";
import BrandAssetUploader from "../components/brand-asset-uploader";
import ColorPickerInput from "../components/color-picker";

interface OnboardingVideoProps {
  step: number;
}

interface TeamMember {
  name: string;
  position: string;
}

interface BrandingContentFormData {
  fontLink: string;
  primaryBrandColor: string;
  secondaryBrandColor: string;
  logoFile: File | null;
  teamPhotos: File[] | null;
  teamMembers: TeamMember[];
  ceoVideo: File | string | null;
  videoCreationOption: "upload" | "studio" | "remote" | "";
}

const initialFormData: BrandingContentFormData = {
  fontLink: "",
  primaryBrandColor: "#007BFF",
  secondaryBrandColor: "#6C757D",
  logoFile: null,
  teamPhotos: null,
  teamMembers: [{ name: "", position: "" }],
  ceoVideo: null,
  videoCreationOption: "upload",
};

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
  const [formData, setFormData] =
    useState<BrandingContentFormData>(initialFormData);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 2;

  const handleTeamMemberChange = (
    index: number,
    field: "name" | "position",
    value: string
  ) => {
    const updatedMembers = formData.teamMembers.map((member, i) =>
      i === index ? { ...member, [field]: value } : member
    );
    setFormData((prevData) => ({
      ...prevData,
      teamMembers: updatedMembers,
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

  const handleFileUpload = (
    file: File | File[] | null,
    field: "logoFile" | "teamPhotos"
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: file,
    }));
  };

  const handleVideoOptionSelect = (option: "studio" | "remote") => {
    setFormData((prevData) => ({
      ...prevData,
      videoCreationOption: option,
      ceoVideo: null,
    }));
  };

  const handleUploadClick = () => {
    setFormData((prevData) => ({
      ...prevData,
      videoCreationOption: "upload",
    }));
    console.log("Upload button clicked. Implement file dialog trigger.");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Form Data Submitted:", formData);

    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/onboarding/success");
    }, 2000);
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

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
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

                    <section className="rounded border bg-muted/20 p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Preview
                        </span>
                        <code className="text-xs text-muted-foreground">
                          {formData.primaryBrandColor}
                        </code>
                      </div>
                      <div
                        className="mt-4 h-12 w-full rounded border"
                        style={{ backgroundColor: formData.primaryBrandColor }}
                      />
                    </section>
                  </div>
                  <div>
                    <ColorPickerInput
                      value={formData.secondaryBrandColor}
                      onChange={(hex) =>
                        handleColorChange("secondaryBrandColor", hex)
                      }
                    />

                    <section className="rounded border bg-muted/20 p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Preview
                        </span>
                        <code className="text-xs text-muted-foreground">
                          {formData.secondaryBrandColor}
                        </code>
                      </div>
                      <div
                        className="mt-4 h-12 w-full rounded border"
                        style={{
                          backgroundColor: formData.secondaryBrandColor,
                        }}
                      />
                    </section>
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
                <Label>
                  Team Members<span className="text-primary">*</span>
                </Label>
                {formData.teamMembers.length > 0 && (
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
                        value={formData.teamMembers[0].name}
                        onChange={(e) =>
                          handleTeamMemberChange(0, "name", e.target.value)
                        }
                        placeholder="Enter name"
                        className={`bg-background`}
                      />
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
                        value={formData.teamMembers[0].position}
                        onChange={(e) =>
                          handleTeamMemberChange(0, "position", e.target.value)
                        }
                        placeholder="Enter position"
                        className={`bg-background `}
                      />
                    </div>
                  </div>
                )}
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
