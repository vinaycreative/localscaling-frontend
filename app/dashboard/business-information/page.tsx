"use client";

import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface BusinessFormData {
  company?: string;
  contactName?: string;
  email?: string;
  contactNumber?: string;
  whatsappNumber?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
}

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
    <div className="flex flex-col gap-4 w-full">
      <div className="space-y-0">
        <h1 className="font-semibold text-foreground">
          1. General Business Information
        </h1>
        <p className="text-sm text-muted-foreground">
          Provide essential company details
        </p>
      </div>

      <div className="relative aspect-video bg-muted rounded overflow-hidden mx-auto">
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

export default function BusinessInformationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<BusinessFormData>({});

  const handleInputChange = (
    field: keyof BusinessFormData,
    value: string
  ): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = (): void => {
    router.push("/dashboard/branding-content");
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

      <div className="grid lg:grid-cols-3 gap-8">
        <OnboardingVideo />

        <div className="space-y-6 lg:col-span-2 bg-background p-4 rounded">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company" className="text-muted-foreground">
                Company name*
              </Label>
              <Input
                id="company"
                type="text"
                placeholder="Company Name"
                className="bg-background"
                value={formData.company || ""}
                onChange={(e) => handleInputChange("company", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName" className="text-muted-foreground">
                  Contact name*
                </Label>
                <Input
                  id="contactName"
                  placeholder="Contact Name"
                  className="bg-background"
                  value={formData.contactName || ""}
                  onChange={(e) =>
                    handleInputChange("contactName", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-muted-foreground">
                  Contact email*
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="info@yourcompany.com"
                  className="bg-background"
                  value={formData.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="contactNumber"
                  className="text-muted-foreground"
                >
                  Contact number*
                </Label>
                <div className="flex">
                  <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
                    <span className="text-sm text-muted-foreground">DE</span>
                  </div>
                  <Input
                    id="contactNumber"
                    placeholder="+1 (555) 000-0000"
                    className="rounded-l-none bg-background"
                    value={formData.contactNumber || ""}
                    onChange={(e) =>
                      handleInputChange("contactNumber", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="whatsappNumber"
                  className="text-muted-foreground"
                >
                  Whatsapp number
                </Label>
                <div className="flex">
                  <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
                    <span className="text-sm text-muted-foreground">DE</span>
                  </div>
                  <Input
                    id="whatsappNumber"
                    placeholder="+44 (555) 000-0000"
                    className="rounded-l-none bg-background"
                    value={formData.whatsappNumber || ""}
                    onChange={(e) =>
                      handleInputChange("whatsappNumber", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="text-muted-foreground">
                Current website
              </Label>
              <div className="flex">
                <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
                  <span className="text-sm text-muted-foreground">
                    https://
                  </span>
                </div>
                <Input
                  id="website"
                  placeholder="www.yoursite.com"
                  className="rounded-l-none bg-background"
                  value={formData.website || ""}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebook" className="text-muted-foreground">
                Facebook link
              </Label>
              <div className="flex">
                <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
                  <span className="text-sm text-muted-foreground">
                    https://
                  </span>
                </div>
                <Input
                  id="facebook"
                  placeholder="www.facebook.com"
                  className="rounded-l-none bg-background"
                  value={formData.facebook || ""}
                  onChange={(e) =>
                    handleInputChange("facebook", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram" className="text-muted-foreground">
                Instagram link
              </Label>
              <div className="flex">
                <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
                  <span className="text-sm text-muted-foreground">
                    https://
                  </span>
                </div>
                <Input
                  id="instagram"
                  placeholder="www.instagram.com"
                  className="rounded-l-none bg-background"
                  value={formData.instagram || ""}
                  onChange={(e) =>
                    handleInputChange("instagram", e.target.value)
                  }
                />
              </div>
            </div>

            <Button
              variant="outline"
              className="flex items-center gap-3 px-4 py-2 border font-medium rounded transition-colors bg-transparent"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                className="flex-shrink-0"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Connect google business profile
            </Button>
          </div>

          <div className="flex p-2 pt-4 justify-end border-t">
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
