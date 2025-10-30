"use client";

import OnboardingVideo from "@/components/reusable/onboarding-video";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
    <section className="w-full h-full grid lg:grid-cols-[auto_1fr] gap-4 overflow-hidden pt-4">
      <OnboardingVideo
        title="4. Tools Access"
        subTitle="Enable analytics and performance tracking."
      />

      <div className="rounded-lg border-border border bg-background w-full h-full grid grid-rows-[auto_60px] overflow-hidden">
        <div className="p-6 h-full overflow-y-scroll flex flex-col gap-4">
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

export default ToolsAccessPage;
