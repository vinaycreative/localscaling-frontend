"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { ToolRow } from "./tool-row";

export function ToolsAccessPanel() {
  const router = useRouter();

  const handlePrev = () => {
    router.push("/dashboard/business-information");
  };

  const handleNext = () => {
    router.push("/dashboard/summary");
  };

  return (
    <div className="px-3 py-2 bg-background border ">
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-foreground">Google Ads *</h3>
        <ToolRow
          id="ads"
          label="Google Ads"
          icon="ads"
          help="Grant your account so we can connect campaigns."
        />
      </div>

      <div className="mb-2">
        <h3 className="text-sm font-semibold text-foreground">
          Google Tag Manager (GTM) *
        </h3>
        <ToolRow
          id="gtm"
          label="GTM access"
          icon="gtm"
          help="Required to add and manage tracking tags."
        />
      </div>

      <div className="mb-2">
        <h3 className="text-sm font-semibold text-foreground">
          Google Analytics 4 (GA4) *
        </h3>
        <ToolRow
          id="ga4"
          label="GA4 access"
          icon="ga4"
          help="Lets us measure performance and conversions."
        />
      </div>

      <div className="mb-2">
        <h3 className="text-sm font-semibold text-foreground">
          Google Search Console *
        </h3>
        <ToolRow
          id="gsc"
          label="Google Search Console"
          icon="gsc"
          help="Monitor indexing and search visibility."
        />
      </div>

      <div className="mt-6 pt-4 border-t flex items-center justify-end gap-2">
        <Button variant="ghost" className="cursor-pointer" onClick={handlePrev}>
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Previous
        </Button>
        <Button className="cursor-pointer" onClick={handleNext}>
          Next
          <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
