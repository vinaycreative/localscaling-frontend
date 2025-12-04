"use client";

import LegalAssetUploader from "@/components/reusable/legal-asset-uploader";
import LegalLinkInput from "@/components/reusable/legal-link-input";
import OnboardingVideo from "@/components/reusable/onboarding-video";
import { TagInput } from "@/components/reusable/tags/tag-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { domainProviders } from "@/constants/website-setup";
import { WebsiteSetupFormData } from "@/interfaces/onboarding/website-setup";
import {
  getWebsiteSetup,
  saveWebsiteSetup,
  WebsiteSetupPayload,
} from "@/lib/api";
import { uploadFileToStorage } from "@/lib/storage";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const initialWebsiteSetupFormData: WebsiteSetupFormData = {
  domainProvider: "",
  accessGranted: false,
  businessClientsWorked: [],
  legalFiles: null,
  legalLinks: [],
  seoLocations: [],
};

export default function WebsiteSetupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingLegalFileUrls, setExistingLegalFileUrls] = useState<string[]>(
    []
  );

  const [formData, setFormData] = useState<WebsiteSetupFormData>(
    initialWebsiteSetupFormData
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getWebsiteSetup();
        const data = response;

        if (data) {
          setFormData((prev) => ({
            ...prev,
            domainProvider: data.domainProvider || "",
            accessGranted: data.accessGranted || false,
            businessClientsWorked: data.businessClientsWorked || [],
            legalLinks: data.legalLinks || [],
            seoLocations: data.seoLocations || [],
            legalFiles: null,
          }));

          if (data.legalFiles && Array.isArray(data.legalFiles)) {
            setExistingLegalFileUrls(data.legalFiles);
          }
        }
      } catch (error) {
        console.error("Failed to load website setup data:", error);
        toast.error("Failed to load existing data.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handlePrev = () => {
    router.push("/tasks/branding-content");
  };

  const handleNext = async () => {
    setIsSubmitting(true);
    try {
      // 1. Upload new files if any
      let newFileUrls: string[] = [];
      if (formData.legalFiles && formData.legalFiles.length > 0) {
        const uploadPromises = formData.legalFiles.map((file) =>
          uploadFileToStorage(file, "documents")
        );
        newFileUrls = await Promise.all(uploadPromises);
      }

      // 2. Combine existing URLs with new URLs
      const allLegalFiles = [...existingLegalFileUrls, ...newFileUrls];

      // 3. Construct Payload
      const payload: WebsiteSetupPayload = {
        domainProvider: formData.domainProvider,
        accessGranted: formData.accessGranted,
        businessClientsWorked: formData.businessClientsWorked,
        legalLinks: formData.legalLinks,
        seoLocations: formData.seoLocations,
        legalFiles: allLegalFiles,
      };

      // 4. Save to API
      await saveWebsiteSetup(payload);

      toast.success("Website setup saved successfully!");
      router.push("/tasks/tools-access");
    } catch (error) {
      console.error("Error saving website setup:", error);
      toast.error("Failed to save changes. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClientsChange = (newClients: string[]) => {
    setFormData((prev) => ({
      ...prev,
      businessClientsWorked: newClients,
    }));
  };

  const handleSEOChange = (seoLocations: string[]) => {
    setFormData((prev) => ({
      ...prev,
      seoLocations,
    }));
  };

  const handleLegalFilesChange = (newFiles: File[]) => {
    setFormData((prev) => ({
      ...prev,
      legalFiles: newFiles,
    }));
  };

  const handleLegalLinksChange = (newLinks: string[]) => {
    setFormData((prev) => ({
      ...prev,
      legalLinks: newLinks,
    }));
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
        title="3. Website Setup"
        subTitle="Define your project scope and objectives."
      />
      <div className="rounded-lg border-border border bg-background w-full h-full grid grid-rows-[auto_60px] overflow-hidden">
        <div className="p-6 h-full overflow-y-scroll flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="domainProvider">
              Domain provider <span className="text-primary">*</span>
            </Label>
            <div className="flex items-center justify-between gap-4">
              <Select
                value={formData.domainProvider}
                onValueChange={(newProvider) => {
                  setFormData({
                    ...formData,
                    domainProvider: newProvider,
                  });
                  if (formData.accessGranted) {
                    setFormData({
                      ...formData,
                      accessGranted: false,
                    });
                  }
                }}
              >
                <SelectTrigger
                  id="domainProvider"
                  className="w-full rounded cursor-pointer focus-visible:ring-[0px]"
                >
                  <SelectValue placeholder="Select domain provider (Fields – Strato, GoDaddy, etc.)" />
                </SelectTrigger>
                <SelectContent className="rounded">
                  {domainProviders.map((domain) => (
                    <SelectItem
                      className="rounded cursor-pointer"
                      key={domain}
                      value={domain}
                    >
                      {domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant={formData.accessGranted ? "default" : "outline"}
                className={`rounded cursor-pointer ${formData.accessGranted && "bg-primary text-primary-foreground"}`}
                onClick={() =>
                  setFormData({
                    ...formData,
                    accessGranted: !formData.accessGranted,
                  })
                }
                disabled={!formData.domainProvider}
                aria-pressed={formData.accessGranted}
              >
                {formData.accessGranted ? "Granted" : "Grant access"}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <TagInput
              label="Business Clients Worked"
              placeholder="e.g., Google, Amazon, Acme Corp (Press Enter to add)"
              value={formData.businessClientsWorked}
              onChange={handleClientsChange}
              required={true}
            />
            <p className="text-xs text-muted-foreground mt-[2px]">
              Enter a client name and press Enter to add it as a tag. Press
              Backspace to remove the last tag.
            </p>
          </div>

          <LegalAssetUploader
            label="Legal Asset Uploader"
            multiple={true}
            value={formData.legalFiles}
            onChange={handleLegalFilesChange}
            maxFiles={5}
          />
          {existingLegalFileUrls.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {existingLegalFileUrls.length} file(s) already uploaded. New files
              will be appended.
            </p>
          )}

          <LegalLinkInput
            value={formData.legalLinks}
            onChange={handleLegalLinksChange}
          />

          <TagInput
            label="Most Important Locations for SEO"
            placeholder="Enter SEO Location"
            value={formData.seoLocations}
            onChange={handleSEOChange}
            required={true}
          />
        </div>
        <div className="flex p-2 pt-4 gap-2 justify-end border-t">
          <Button
            type="button"
            variant="outline"
            className="rounded bg-transparent cursor-pointer group"
            onClick={handlePrev}
            disabled={isSubmitting}
          >
            <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-all duration-300" />
            Previous
          </Button>

          <Button
            type="button"
            className="rounded bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer group"
            onClick={handleNext}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                Saving...
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-all duration-300" />
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
