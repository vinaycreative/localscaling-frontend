"use client";

import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { OnboardingHeader } from "../business-information/page";

const OnboardingVideo = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-0">
        <h2 className="font-semibold text-foreground">4. Tools Access</h2>
        <p className="text-sm text-muted-foreground">
          Enable analytics and performance tracking.
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

interface AccessGrantButtonProps {
  iconSrc: string | null;
  iconAlt: string;
  text: string;
}

const AccessGrantButton = ({
  iconSrc,
  iconAlt,
  text,
}: AccessGrantButtonProps) => {
  return (
    <Button
      type="button"
      variant="outline"
      className="rounded px-4 cursor-pointer hover:bg-muted/20 transition-all duration-300"
    >
      {iconSrc && (
        <div className="mr-3">
          <Image
            src={iconSrc}
            alt={iconAlt}
            width={20}
            height={20}
            className="w-5 h-5 object-contain"
          />
        </div>
      )}
      <span className="text-sm">{text}</span>
    </Button>
  );
};

interface AccessToolFieldProps {
  title: string;
  iconSrc: string | null;
  buttonText: string;
  required?: boolean;
}

const AccessToolField = ({
  title,
  iconSrc,
  buttonText,
  required = true,
}: AccessToolFieldProps) => (
  <div className="space-y-2">
    <Label>
      {title}
      {required && <span className="text-primary">*</span>}
    </Label>
    <AccessGrantButton
      iconSrc={iconSrc}
      iconAlt={`${title} icon`}
      text={buttonText}
    />
  </div>
);

function ToolsAccessPage() {
  const router = useRouter();
  const handlePrev = () => {
    router.push("/tasks/website-setup");
  };

  const handleNext = () => {
    router.push("/tasks/locations-budget");
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
      <div className="grid lg:grid-cols-3 gap-8 ">
        <OnboardingVideo />

        <div className="lg:col-span-2 bg-card rounded border p-4 sm:p-6 space-y-6">
          <div className="space-y-6">
            <AccessToolField
              title="Google Ads"
              iconSrc="/google-ads.png"
              buttonText="Grant google ads access"
            />
            <AccessToolField
              title="Google Tag Manager (GTM)"
              iconSrc="/google-tag.svg"
              buttonText="Grant GTM access"
            />
            <AccessToolField
              title="Google Analytics 4 (GA4)"
              iconSrc="/google-analytics.png"
              buttonText="Grant GA4 access"
            />
            <AccessToolField
              title="Google Search Console"
              iconSrc={null}
              buttonText="Grant google search console access"
            />
          </div>
          <div className="flex pb-1 pt-4 gap-2 justify-end border-t">
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
      </div>
    </div>
  );
}

export default ToolsAccessPage;
