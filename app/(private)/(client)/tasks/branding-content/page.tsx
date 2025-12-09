"use client";

import BrandAssetUploader from "@/components/reusable/brand-asset-uploader";
import ColorPickerInput from "@/components/reusable/color-picker";
import { CustomInput } from "@/components/reusable/custom-input";
import OnboardingVideo from "@/components/reusable/onboarding-video";
import { VideoUpload } from "@/components/reusable/video-upload";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  BrandingContentFormData,
  IntroductoryVideoOption,
  TeamMember,
} from "@/interfaces/onboarding/branding-content";
import { uploadFileToStorage } from "@/lib/storage";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TeamMemberList } from "./components/member-entry-list";
import { getBrandingInfo, saveBrandingInfo } from "@/api/branding-info";

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

const urlToFile = async (
  url: string,
  filename: string,
  mimeType: string
): Promise<File> => {
  if (!url) return new File([], filename);
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: mimeType });
  } catch (e) {
    console.error("Error converting URL to File:", e);
    return new File([], filename);
  }
};

function BrandingContentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] =
    useState<BrandingContentFormData>(initialFormData);
  const [introVideoOption, setIntroVideoOption] =
    useState<IntroductoryVideoOption>("upload");

  const [savedUrls, setSavedUrls] = useState<{
    logo?: string;
    teamPhotos?: string[];
    ceoVideo?: string;
    videoTestimonial?: string;
  }>({});

  const totalSteps = 3;

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getBrandingInfo();

        if (response && response.data) {
          const dbData = response.data;

          let logoFile = null;
          if (dbData.logoUrl) {
            logoFile = await urlToFile(dbData.logoUrl, "logo.png", "image/png");
          }

          let teamPhotos: File[] = [];
          if (dbData.teamPhotoUrls && Array.isArray(dbData.teamPhotoUrls)) {
            teamPhotos = await Promise.all(
              dbData.teamPhotoUrls.map((url: string, index: number) =>
                urlToFile(url, `team-${index}.jpg`, "image/jpeg")
              )
            );
          }

          let ceoVideo = null;
          if (dbData.ceoVideoUrl) {
            ceoVideo = await urlToFile(
              dbData.ceoVideoUrl,
              "ceo-intro.mp4",
              "video/mp4"
            );
          }

          let videoTestimonial = null;
          if (dbData.videoTestimonialUrl) {
            videoTestimonial = await urlToFile(
              dbData.videoTestimonialUrl,
              "testimonial.mp4",
              "video/mp4"
            );
          }

          setSavedUrls({
            logo: dbData.logoUrl,
            teamPhotos: dbData.teamPhotoUrls,
            ceoVideo: dbData.ceoVideoUrl,
            videoTestimonial: dbData.videoTestimonialUrl,
          });

          setFormData({
            fontLink: dbData.fontLink || "",
            primaryBrandColor: dbData.primaryBrandColor || "#007BFF",
            secondaryBrandColor: dbData.secondaryBrandColor || "#6C757D",
            logoFile: logoFile,
            teamPhotos: teamPhotos.length > 0 ? teamPhotos : null,
            teamMembers: dbData.teamMembers || [{ name: "", position: "" }],
            videoCreationOption: dbData.videoCreationOption || "upload",
            ceoVideo: ceoVideo,
            videoTestimonial: videoTestimonial,
          });

          if (dbData.videoCreationOption) {
            setIntroVideoOption(dbData.videoCreationOption);
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // LOGO -> branding-assets/logos
      let logoUrl = savedUrls.logo || "";
      if (formData.logoFile && formData.logoFile.size > 0) {
        // Optimization: Skip upload if it's the same file content (simple check would be name/size/type match against saved)
        // For now, we upload to ensure consistency.
        logoUrl = await uploadFileToStorage(
          formData.logoFile,
          "branding-assets",
          "logos"
        );
      }

      // TEAM PHOTOS -> branding-assets/team
      let teamPhotoUrls: string[] = savedUrls.teamPhotos || [];
      if (formData.teamPhotos && formData.teamPhotos.length > 0) {
        const uploadPromises = formData.teamPhotos.map((f) =>
          uploadFileToStorage(f, "branding-assets", "team")
        );
        teamPhotoUrls = await Promise.all(uploadPromises);
      }

      // CEO VIDEO -> videos/ceo-intro
      let ceoVideoUrl = savedUrls.ceoVideo || "";
      if (formData.ceoVideo) {
        ceoVideoUrl = await uploadFileToStorage(
          formData.ceoVideo,
          "videos",
          "ceo-intro"
        );
      }

      // TESTIMONIALS -> videos/testimonials
      let videoTestimonialUrl = savedUrls.videoTestimonial || "";
      if (formData.videoTestimonial) {
        videoTestimonialUrl = await uploadFileToStorage(
          formData.videoTestimonial,
          "videos",
          "testimonials"
        );
      }

      const payload = {
        fontLink: formData.fontLink,
        primaryBrandColor: formData.primaryBrandColor,
        secondaryBrandColor: formData.secondaryBrandColor,
        logoUrl: logoUrl,
        teamPhotoUrls: teamPhotoUrls,
        teamMembers: formData.teamMembers,
        videoCreationOption: formData.videoCreationOption,
        ceoVideoUrl: ceoVideoUrl,
        videoTestimonialUrl: videoTestimonialUrl,
      };

      console.log("Submitting CamelCase Payload:", payload);

      await saveBrandingInfo(payload);

      toast.success("Branding information saved!");
      router.push("/tasks/website-setup");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
      router.push("/tasks/business-information");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="w-full h-full grid lg:grid-cols-[auto_1fr] gap-4 overflow-hidden pt-4">
      <OnboardingVideo
        title={`2.${currentStep} Branding & Content`}
        subTitle="Submit brand assets for a consistent identity."
      />

      <div className="rounded-lg border-border border bg-background w-full h-full grid grid-rows-[auto_60px] overflow-hidden">
        {currentStep === 1 && (
          <div className="p-6 h-full overflow-y-scroll flex flex-col gap-4">
            <div className="mb-4">
              <h3 className="text-xl font-semibold">Brand Identity</h3>
              <p className="text-sm text-muted-foreground">
                Set up your brand colors, fonts, and logo
              </p>
            </div>
            <CustomInput
              label="Font Link"
              id="fontLink"
              type="text"
              placeholder="www.fontlink.com"
              required={true}
              value={formData.fontLink}
              onChange={handleChange}
              prefixText="https://"
            />
            <div className="space-y-2.5">
              <Label>Brand Colors (Hex Code)</Label>
              <div className="flex flex-col gap-2">
                <ColorPickerInput
                  value={formData.primaryBrandColor}
                  onChange={(hex) =>
                    handleColorChange("primaryBrandColor", hex)
                  }
                />
                <ColorPickerInput
                  value={formData.secondaryBrandColor}
                  onChange={(hex) =>
                    handleColorChange("secondaryBrandColor", hex)
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Enter a hex code like #3B82F6 or #fff, or pick from the
                  palette.
                </p>
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
        )}

        {currentStep === 2 && (
          <div className="p-6 h-full overflow-y-scroll flex flex-col gap-4">
            <p className="text-muted-foreground italic text-xs">
              Please watch the entire video, before proceeding with the form.
            </p>

            <VideoUpload
              label=" CEO introductory video"
              value={formData.ceoVideo}
              onChange={(file) => handleFileUpload(file, "ceoVideo")}
              required={true}
            />

            <p className="text-sm">
              Do not have an introductory video? Choose how you&apos;d like us
              to help you create one.
            </p>

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
              Schedule an online session, our team will guide you over a video
              call and edit it for you.
            </p>
          </div>
        )}

        {currentStep === 3 && (
          <div className="p-6 h-full overflow-y-scroll flex flex-col gap-4">
            <p className="text-muted-foreground italic text-xs">
              Please watch the entire video, before proceeding with the form.
            </p>

            <VideoUpload
              label="Video Testimonials"
              value={formData.videoTestimonial}
              onChange={(file) => handleFileUpload(file, "videoTestimonial")}
              required={true}
            />
          </div>
        )}

        <div className="flex p-2 pt-4 gap-2 justify-end border-t">
          <Button
            variant="outline"
            className="rounded bg-transparent cursor-pointer group"
            onClick={handlePrevious}
            disabled={isSubmitting}
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
              {isSubmitting ? "Submitting..." : "Submit"}
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              ) : (
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-all duration-300" />
              )}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

export default BrandingContentPage;
