"use client";

import type React from "react";

import Page from "@/components/layouts/Page";
import { CustomInput } from "@/components/reusable/custom-input";
import { Button } from "@/components/ui/button";
import type { AddClientFormData } from "@/interfaces/client/add-client";
import {
  ArrowLeft,
  ChevronRight,
  FileQuestion as CircleQuestionMark,
  Mail,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const COUNTRY_OPTIONS = [
  { value: "US", label: "United States" },
  { value: "UK", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "IN", label: "India" },
  { value: "JP", label: "Japan" },
];

const STATE_OPTIONS = [
  { value: "CA", label: "California" },
  { value: "NY", label: "New York" },
  { value: "TX", label: "Texas" },
  { value: "FL", label: "Florida" },
  { value: "IL", label: "Illinois" },
  { value: "PA", label: "Pennsylvania" },
  { value: "OH", label: "Ohio" },
  { value: "GA", label: "Georgia" },
];

function AddClientPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<AddClientFormData>({
    companyName: "",
    clientName: "",
    clientEmail: "",
    vatId: "",
    streetAddress: "",
    postalCode: "",
    city: "",
    state: "",
    country: "",
    monthlyPayment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log("Submitting client data:", formData);

    setTimeout(() => {
      setIsSubmitting(false);
      handleBack();
    }, 1000);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSelectChange = (id: keyof AddClientFormData, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleBack = (): void => {
    router.back();
  };

  return (
    <Page
      navURL="clients"
      title="Add New Client"
      description="Enter client details and billing information"
    >
      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-hidden flex flex-col"
      >
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-4 max-w-4xl bg-background p-4 rounded ">
            <CustomInput
              label="Company name"
              id="companyName"
              type="text"
              placeholder="Webbywolf Innovations"
              required={true}
              value={formData.companyName}
              onChange={handleChange}
              className="col-span-2"
            />

            <CustomInput
              label="Client name"
              id="clientName"
              type="text"
              placeholder="Olivia"
              required={true}
              value={formData.clientName}
              onChange={handleChange}
            />
            <CustomInput
              label="Client email"
              id="clientEmail"
              type="email"
              placeholder="olivia@littlecloud.com"
              required={true}
              value={formData.clientEmail}
              onChange={handleChange}
              PrefixIcon={Mail}
              SuffixIcon={CircleQuestionMark}
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
              label="Street address"
              id="streetAddress"
              type="text"
              placeholder="123 Main Street"
              required={true}
              value={formData.streetAddress}
              onChange={handleChange}
              className="col-span-2"
            />

            <CustomInput
              label="Postal code"
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
              placeholder="Select state"
              required={true}
              value={formData.state}
              select={true}
              selectOptions={STATE_OPTIONS}
              onSelectChange={(value) => handleSelectChange("state", value)}
            />
            <CustomInput
              label="Country"
              id="country"
              placeholder="Select country"
              required={true}
              value={formData.country}
              select={true}
              selectOptions={COUNTRY_OPTIONS}
              onSelectChange={(value) => handleSelectChange("country", value)}
            />

            <CustomInput
              label="Monthly payment (Excluding taxes)"
              id="monthlyPayment"
              type="text"
              placeholder="$5,000"
              required={true}
              value={formData.monthlyPayment}
              onChange={handleChange}
              className="col-span-2"
              prefixText="$"
            />
          </div>
        </div>

        <div className="border-t border-border px-6 py-4 flex items-center justify-end bg-background">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded group bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
          >
            {isSubmitting ? "Saving..." : "Add lead"}
            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-all duration-300" />
          </Button>
        </div>
      </form>
    </Page>
  );
}

export default AddClientPage;
