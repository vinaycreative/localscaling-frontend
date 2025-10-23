"use client";

import type React from "react";

import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OnboardingHeader } from "../business-information/page";
import { TagInput } from "../website-setup/components/tag-input";

const OnboardingVideo = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-0">
        <h2 className="font-semibold text-foreground">5. Locations & Budget</h2>
        <p className="text-sm text-muted-foreground">
          Set your ads budget and its location.
        </p>
      </div>

      <div className="relative aspect-video bg-muted rounded overflow-hidden ">
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

const initialFormData = {
  budget: 1000,
  currency: "EUR",
  locations: ["Hamburg", "Mainz", "Dortmund", "Berlin"],
  services: ["Local SEO Audit", "PPC Management"],
};

function LocationsBudgetPage() {
  const [formData, setFormData] = useState(initialFormData);
  const router = useRouter();
  const handlePrev = () => {
    router.push("/tasks/tools-access");
  };

  const handleNext = () => {
    router.push("/dashboard");
  };

  const handleCurrencyChange = (value: string) => {
    setFormData({ ...formData, currency: value });
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const budgetValue = Number.parseInt(e.target.value) || 0;
    setFormData({ ...formData, budget: budgetValue });
  };

  const handleLocationChange = (value: string[]) => {
    setFormData({ ...formData, locations: value });
  };
  const handleServicesChange = (value: string[]) => {
    setFormData({ ...formData, services: value });
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
            <div className="space-y-2">
              <Label>
                Set monthly ads budget <span className="text-primary">*</span>
              </Label>
              <div className="flex rounded border ">
                <Select
                  value={formData.currency}
                  onValueChange={handleCurrencyChange}
                >
                  <SelectTrigger className="focus-visible:ring-[0px] border-0 cursor-pointer hover:bg-muted/20 transition-all duration-300 border-r rounded-r-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded">
                    <SelectItem
                      value="EUR"
                      className="rounded transition-all duration-300 cursor-pointer"
                    >
                      € (EUR)
                    </SelectItem>
                    <SelectItem
                      value="USD"
                      className="rounded transition-all duration-300 cursor-pointer"
                    >
                      $ (USD)
                    </SelectItem>
                    <SelectItem
                      value="GBP"
                      className="rounded transition-all duration-300 cursor-pointer"
                    >
                      £ (GBP)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={handleBudgetChange}
                  className="rounded-l-none border-0"
                  placeholder="1000"
                  min="0"
                  required
                />
              </div>
            </div>
            <TagInput
              label="Most important locations for SEO"
              placeholder="e.g., Berlin, London, New York"
              value={formData.locations}
              onChange={handleLocationChange}
              required
            />
            <TagInput
              label="Services provided"
              placeholder="e.g., Web Design, Content Writing, PPC"
              value={formData.services}
              onChange={handleServicesChange}
              required
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

export default LocationsBudgetPage;
