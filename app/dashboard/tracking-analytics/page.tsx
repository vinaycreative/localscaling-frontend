"use client";

import type React from "react";

import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Types
interface AnalyticsSetupFormData {
  gtmConnected?: boolean;
  ga4Connected?: boolean;
  googleAdsConnected?: boolean;
}

// Header Component
const OnboardingHeader = () => (
  <div className="flex flex-col gap-4">
    <div className="flex gap-2 text-primary items-center cursor-pointer">
      <ArrowLeft className="h-3 w-3" />
      Dashboard
    </div>
  </div>
);

// Video Component
const OnboardingVideo = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-0">
        <h1 className="font-semibold text-foreground">4. Analytics Setup</h1>
        <p className="text-sm text-muted-foreground">
          Enable analytics and performance tracking.
        </p>
      </div>

      <div className="relative aspect-video bg-muted rounded overflow-hidden">
        <Image
          src="/video.jpg"
          alt="Analytics setup consultation video"
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

function AnalyticsSetupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<AnalyticsSetupFormData>({});

  const handleGTMConnect = (): void => {
    setFormData((prev) => ({
      ...prev,
      gtmConnected: true,
    }));
  };

  const handleGA4Connect = (): void => {
    setFormData((prev) => ({
      ...prev,
      ga4Connected: true,
    }));
  };

  const handleGoogleAdsConnect = (): void => {
    setFormData((prev) => ({
      ...prev,
      googleAdsConnected: true,
    }));
  };

  const handleNext = (): void => {
    console.log("Analytics setup completed!");
    // Navigate to next step or dashboard
  };

  const handlePrevious = (): void => {
    router.push("/dashboard/website-setup");
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
          launch.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <OnboardingVideo />

        <div className="space-y-6 lg:col-span-2 bg-background p-4 rounded">
          <div className="space-y-6">
            {/* Google Tag Manager */}
            <div className="space-y-3">
              <Label className="text-muted-foreground flex items-center gap-2">
                Google Tag Manager (GTM)
                <svg
                  className="w-4 h-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9,9h6v6H9V9z" />
                </svg>
              </Label>
              <Button
                variant="outline"
                onClick={handleGTMConnect}
                className={`flex items-center gap-3 px-4 py-2 border font-medium rounded transition-colors ${
                  formData.gtmConnected
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-transparent"
                }`}
              >
                <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">G</span>
                </div>
                {formData.gtmConnected ? "GTM Connected" : "Grant GTM access"}
              </Button>
            </div>

            {/* Google Analytics 4 */}
            <div className="space-y-3">
              <Label className="text-muted-foreground flex items-center gap-2">
                Google Analytics 4 (GA4)
                <svg
                  className="w-4 h-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9,9h6v6H9V9z" />
                </svg>
              </Label>
              <Button
                variant="outline"
                onClick={handleGA4Connect}
                className={`flex items-center gap-3 px-4 py-2 border font-medium rounded transition-colors ${
                  formData.ga4Connected
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-transparent"
                }`}
              >
                <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
                  </svg>
                </div>
                {formData.ga4Connected ? "GA4 Connected" : "Grant GA4 access"}
              </Button>
            </div>

            {/* Google Ads Conversion Tracking */}
            <div className="space-y-3">
              <Label className="text-muted-foreground flex items-center gap-2">
                Google Ads Conversion Tracking
                <svg
                  className="w-4 h-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9,9h6v6H9V9z" />
                </svg>
              </Label>
              <Button
                variant="outline"
                onClick={handleGoogleAdsConnect}
                className={`flex items-center gap-3 px-4 py-2 border font-medium rounded transition-colors ${
                  formData.googleAdsConnected
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-transparent"
                }`}
              >
                <div className="w-5 h-5 bg-yellow-500 rounded flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                {formData.googleAdsConnected
                  ? "Google Ads Connected"
                  : "Grant google ads access"}
              </Button>
            </div>
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

export default AnalyticsSetupPage;
