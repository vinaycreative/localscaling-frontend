"use client";

import Page from "@/components/layout/page";
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
import { BusinessFormData } from "@/interfaces/onboarding/business-information";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import OnboardHeading from "../components/onboarding-heading";
import OnboardingVideo from "./components/onboarding-video";

const generateYearOptions = (startYear: number, endYear: number) => {
  const years = [];
  for (let year = endYear; year >= startYear; year--) {
    years.push(year.toString());
  }
  return years;
};
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = generateYearOptions(1900, CURRENT_YEAR);

function BusinessInformationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<BusinessFormData>({
    company: "",
    startYear: "",
    streetAddress: "",
    postalCode: "",
    city: "",
    state: "",
    country: "",
    vatId: "",
    contactName: "",
    email: "",
    contactNumber: "",
    whatsappNumber: "",
    website: "",
    facebook: "",
    instagram: "",
    twitter: "",
    googleBusinessProfileLink: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log("Submitting local data:", formData);

    setTimeout(() => {
      setIsSubmitting(false);
      handleNext();
    }, 1000);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleNext = (): void => {
    router.push("/tasks/branding-content");
  };

  return (
    <Page navURL="Dashboard">
      <OnboardHeading />

      <div className="flex flex-col lg:flex-row gap-8 overflow-hidden mt-6 pb-2 flex-1">
        <OnboardingVideo />
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-background rounded border w-full h-full flex flex-col overflow-hidden shadow-xl"
        >
          <div className="space-y-6 p-6 flex-1 overflow-auto w-full h-full">
            <div className="grid lg:grid-cols-5 gap-6">
              <div className="space-y-2 lg:col-span-3">
                <Label htmlFor="company">
                  Company Name <span className="text-primary">*</span>
                </Label>
                <Input
                  id="company"
                  type="text"
                  placeholder="Company Name"
                  className="bg-background rounded focus-visible:ring-[0px]"
                  value={formData.company}
                  onChange={(event) => handleChange(event)}
                />
              </div>
              <div className="space-y-2 lg:col-span-2">
                <Label htmlFor="startYear">
                  Company Start Year <span className="text-primary">*</span>
                </Label>
                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, startYear: value })
                  }
                  value={formData.startYear}
                >
                  <SelectTrigger className="w-full bg-background cursor-pointer rounded focus-visible:ring-[0spx]">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent className="cursor-pointer rounded">
                    {YEAR_OPTIONS.map((year) => (
                      <SelectItem
                        key={year}
                        value={year}
                        className="cursor-pointer transition-all duration-300 rounded"
                      >
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="streetAddress">
                Street Address <span className="text-primary">*</span>
              </Label>
              <Input
                id="streetAddress"
                type="text"
                placeholder="123 Main St"
                className="bg-background rounded focus-visible:ring-[0px]"
                value={formData.streetAddress}
                onChange={(event) => handleChange(event)}
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="postalCode">
                  Postal Code <span className="text-primary">*</span>
                </Label>
                <Input
                  id="postalCode"
                  type="text"
                  placeholder="10001"
                  className="bg-background rounded focus-visible:ring-[0px]"
                  value={formData.postalCode}
                  onChange={(event) => handleChange(event)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">
                  City<span className="text-primary">*</span>
                </Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="New York"
                  className="bg-background rounded focus-visible:ring-[0px]"
                  value={formData.city}
                  onChange={(event) => handleChange(event)}
                />
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="state">
                  State<span className="text-primary">*</span>
                </Label>
                <Input
                  id="state"
                  type="text"
                  placeholder="NY"
                  className="bg-background rounded focus-visible:ring-[0px]"
                  value={formData.state}
                  onChange={(event) => handleChange(event)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">
                  Country<span className="text-primary">*</span>
                </Label>
                <Input
                  id="country"
                  type="text"
                  placeholder="USA"
                  className="bg-background rounded focus-visible:ring-[0px]"
                  value={formData.country}
                  onChange={(event) => handleChange(event)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vatId">
                VAT ID<span className="text-primary">*</span>
              </Label>
              <Input
                id="vatId"
                type="text"
                placeholder="DE123456789"
                className="bg-background rounded focus-visible:ring-[0px]"
                value={formData.vatId}
                onChange={(event) => handleChange(event)}
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contactName">
                  Contact name<span className="text-primary">*</span>
                </Label>
                <Input
                  id="contactName"
                  placeholder="Contact Name"
                  className="bg-background rounded focus-visible:ring-[0px]"
                  value={formData.contactName}
                  onChange={(event) => handleChange(event)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  Contact email<span className="text-primary">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="info@yourcompany.com"
                  className="bg-background rounded focus-visible:ring-[0px]"
                  value={formData.email}
                  onChange={(event) => handleChange(event)}
                />
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contactNumber">
                  Contact number<span className="text-primary">*</span>
                </Label>
                <div className="flex">
                  <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l">
                    <span className="text-sm text-muted-foreground">DE</span>
                  </div>
                  <Input
                    id="contactNumber"
                    placeholder="+1 (555) 000-0000"
                    className="bg-background rounded rounded-l-none focus-visible:ring-[0px]"
                    value={formData.contactNumber}
                    onChange={(event) => handleChange(event)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsappNumber">Whatsapp number</Label>
                <div className="flex">
                  <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l">
                    <span className="text-sm text-muted-foreground">DE</span>
                  </div>
                  <Input
                    id="whatsappNumber"
                    placeholder="+44 (555) 000-0000"
                    className="bg-background rounded rounded-l-none focus-visible:ring-[0px]"
                    value={formData.whatsappNumber}
                    onChange={(event) => handleChange(event)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">
                Current website<span className="text-primary">*</span>
              </Label>
              <div className="flex">
                <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l">
                  <span className="text-sm text-muted-foreground">
                    https://
                  </span>
                </div>
                <Input
                  id="website"
                  placeholder="www.yoursite.com"
                  className="bg-background rounded rounded-l-none focus-visible:ring-[0px]"
                  value={formData.website}
                  onChange={(event) => handleChange(event)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook link</Label>
              <div className="flex">
                <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l">
                  <span className="text-sm text-muted-foreground">
                    https://
                  </span>
                </div>
                <Input
                  id="facebook"
                  placeholder="www.facebook.com"
                  className="bg-background rounded rounded-l-none focus-visible:ring-[0px]"
                  value={formData.facebook}
                  onChange={(event) => handleChange(event)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram link</Label>
              <div className="flex">
                <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l">
                  <span className="text-sm text-muted-foreground">
                    https://
                  </span>
                </div>
                <Input
                  id="instagram"
                  placeholder="www.instagram.com"
                  className="bg-background rounded rounded-l-none focus-visible:ring-[0px]"
                  value={formData.instagram}
                  onChange={(event) => handleChange(event)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter">X (Twitter) link</Label>
              <div className="flex">
                <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l">
                  <span className="text-sm text-muted-foreground">
                    https://
                  </span>
                </div>
                <Input
                  id="twitter"
                  placeholder="www.x.com"
                  className="bg-background rounded rounded-l-none focus-visible:ring-[0px]"
                  value={formData.twitter}
                  onChange={(event) => handleChange(event)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="googleBusinessProfileLink">
                Google Business Profile link
              </Label>
              <div className="flex">
                <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l">
                  <span className="text-sm text-muted-foreground">
                    https://
                  </span>
                </div>
                <Input
                  id="googleBusinessProfileLink"
                  placeholder="maps.app.goo.gl/..."
                  className="bg-background rounded rounded-l-none focus-visible:ring-[0px]"
                  value={formData.googleBusinessProfileLink}
                  onChange={(event) => handleChange(event)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end border-t px-8 py-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded group bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
            >
              {isSubmitting ? "Saving..." : "Next"}
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-all duration-300" />
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
}

export default BusinessInformationPage;
