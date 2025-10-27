"use client";

import { CustomInput } from "@/components/reusable/custom-input";
import { Button } from "@/components/ui/button";
import { BusinessFormData } from "@/interfaces/onboarding/business-information";
import { ChevronRight, CircleQuestionMark, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import OnboardingVideo from "./components/onboarding-video";

const generateYearOptions = (startYear: number, endYear: number) => {
  const years = [];
  for (let year = endYear; year >= startYear; year--) {
    years.push(year.toString());
  }
  return years;
};
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS_VALUES = generateYearOptions(1900, CURRENT_YEAR);

const YEAR_OPTIONS = YEAR_OPTIONS_VALUES.map((year) => ({
  value: year,
  label: year,
}));

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

  const handleSelectChange = (id: keyof BusinessFormData, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleNext = (): void => {
    router.push("/tasks/branding-content");
  };

  return (
    <section className="w-full h-full grid grid-cols-[auto_1fr] gap-4 overflow-hidden pt-4">
      <OnboardingVideo />
      <form
        onSubmit={handleSubmit}
        className="rounded-lg border-border border bg-background w-full h-full grid grid-rows-[auto_60px] overflow-hidden"
      >
        <div className="p-6 h-full grid grid-cols-2 overflow-y-scroll gap-4">
          <CustomInput
            label="Company Name"
            id="company"
            type="text"
            placeholder="Company Name"
            required={true}
            value={formData.company}
            onChange={handleChange}
          />
          <CustomInput
            label="Company Start Year"
            id="startYear"
            placeholder="Year"
            required={true}
            value={formData.startYear}
            select={true}
            selectOptions={YEAR_OPTIONS}
            onSelectChange={(value) => handleSelectChange("startYear", value)}
          />
          <CustomInput
            label="Street Address"
            id="streetAddress"
            type="text"
            placeholder="123 Main St"
            required={true}
            value={formData.streetAddress}
            onChange={handleChange}
            className="col-span-2"
          />
          <CustomInput
            label="Postal Code"
            id="postalCode"
            type="text"
            placeholder="10001"
            required={true}
            value={formData.postalCode}
            onChange={handleChange}
          />
          <CustomInput
            label="City"
            id="city"
            type="text"
            placeholder="New York"
            required={true}
            value={formData.city}
            onChange={handleChange}
          />
          <CustomInput
            label="State"
            id="state"
            type="text"
            placeholder="NY"
            required={true}
            value={formData.state}
            onChange={handleChange}
          />
          <CustomInput
            label="Country"
            id="country"
            type="text"
            placeholder="USA"
            required={true}
            value={formData.country}
            onChange={handleChange}
          />
          <CustomInput
            label="VAT ID"
            id="vatId"
            type="text"
            placeholder="DE123456789"
            required={true}
            value={formData.vatId}
            onChange={handleChange}
            className="col-span-2"
          />
          <CustomInput
            label="Contact name"
            id="contactName"
            type="text"
            placeholder="Contact Name"
            required={true}
            value={formData.contactName}
            onChange={handleChange}
          />
          <CustomInput
            label="Contact email"
            id="email"
            type="email"
            placeholder="info@yourcompany.com"
            required={true}
            value={formData.email}
            onChange={handleChange}
            PrefixIcon={Mail}
            SuffixIcon={CircleQuestionMark}
          />
          <CustomInput
            label="Contact number"
            id="contactNumber"
            type="text"
            placeholder="+1 (555) 000-0000"
            required={true}
            value={formData.contactNumber}
            onChange={handleChange}
            prefixText={"DE"}
            SuffixIcon={CircleQuestionMark}
          />
          <CustomInput
            label="Whatsapp number"
            id="whatsappNumber"
            type="text"
            placeholder="+44 (555) 000-0000"
            required={false}
            value={formData.whatsappNumber}
            onChange={handleChange}
            prefixText={"DE"}
            SuffixIcon={CircleQuestionMark}
          />
          <CustomInput
            label="Current website"
            id="website"
            type="text"
            placeholder="www.yoursite.com"
            required={true}
            value={formData.website}
            onChange={handleChange}
            className="col-span-2"
            prefixText={"http://"}
          />
          <CustomInput
            label="Facebook link"
            id="facebook"
            type="text"
            placeholder="www.facebook.com"
            required={false}
            value={formData.facebook}
            onChange={handleChange}
            className="col-span-2"
            prefixText={"http://"}
          />
          <CustomInput
            label="Instagram link"
            id="instagram"
            type="text"
            placeholder="www.instagram.com"
            required={false}
            value={formData.instagram}
            onChange={handleChange}
            className="col-span-2"
            prefixText={"http://"}
          />
          <CustomInput
            label="X (Twitter) link"
            id="twitter"
            type="text"
            placeholder="www.x.com"
            required={false}
            value={formData.twitter}
            onChange={handleChange}
            className="col-span-2"
            prefixText={"http://"}
          />
          <CustomInput
            label="Google Business Profile link"
            id="googleBusinessProfileLink"
            type="text"
            placeholder="maps.app.goo.gl/..."
            required={false}
            value={formData.googleBusinessProfileLink}
            onChange={handleChange}
            className="col-span-2"
            prefixText={"http://"}
          />
        </div>
        <div className="px-4 border-t  flex items-center justify-end">
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
    </section>
  );
}

export default BusinessInformationPage;
