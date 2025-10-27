"use client";

import type React from "react";

import OnboardingVideo from "@/components/reusable/onboarding-video";
import { TagInput } from "@/components/reusable/tags/tag-input";
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
import { useRouter } from "next/navigation";
import { useState } from "react";

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
    <section className="w-full h-full grid lg:grid-cols-[auto_1fr] gap-4 overflow-hidden pt-4">
      <OnboardingVideo
        title="5. Locations & Budget"
        subTitle="Set your ads budget and its location."
      />

      <div className="rounded-lg border-border border bg-background w-full h-full grid grid-rows-[auto_60px] overflow-hidden">
        <div className="p-6 h-full overflow-y-scroll flex flex-col gap-4">
          <div className="space-y-2.5">
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
            Submit
            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-all duration-300" />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default LocationsBudgetPage;
