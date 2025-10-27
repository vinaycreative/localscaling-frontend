"use client";

import LegalAssetUploader from "@/components/reusable/legal-asset-uploader";
import LegalLinkInput from "@/components/reusable/legal-link-input";
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
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const OnboardingVideo = () => {
  return (
    <div className="flex flex-col gap-4 w-[360px]">
      <div className="space-y-0">
        <h2 className="font-semibold text-foreground">3. Website Setup</h2>
        <p className="text-sm text-muted-foreground">
          Grant access for website configuration.
        </p>
      </div>

      <div className="relative aspect-video bg-muted rounded overflow-hidden">
        <Image
          src="/video.jpg"
          alt="Business consultation video"
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
  const [formData, setFormData] = useState<WebsiteSetupFormData>(
    initialWebsiteSetupFormData
  );

  const handlePrev = () => {
    router.push("/tasks/branding-content");
  };

  const handleNext = () => {
    router.push("/tasks/tools-access");
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

  return (
    <section className="w-full h-full grid grid-cols-[auto_1fr] gap-4 overflow-hidden pt-4">
      <OnboardingVideo />

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
          >
            <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-all duration-300" />
            Previous
          </Button>

          <Button
            type="button"
            className="rounded bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer group"
            onClick={handleNext}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-all duration-300" />
          </Button>
        </div>
      </div>
    </section>
  );
}
