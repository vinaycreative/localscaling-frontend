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
        {/* form content */}
        {/* <div className="space-y-4 p-6 w-full overflow-auto bg-purple-600">
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
                onValueChange={(value) => setFormData({ ...formData, startYear: value })}
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
                <span className="text-sm text-muted-foreground">https://</span>
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
                <span className="text-sm text-muted-foreground">https://</span>
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
                <span className="text-sm text-muted-foreground">https://</span>
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
                <span className="text-sm text-muted-foreground">https://</span>
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
            <Label htmlFor="googleBusinessProfileLink">Google Business Profile link</Label>
            <div className="flex">
              <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l">
                <span className="text-sm text-muted-foreground">https://</span>
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
        </div> */}
        {/* form footer */}
        {/* <div className="flex justify-end border-t bg-pink-600">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded group bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
          >
            {isSubmitting ? "Saving..." : "Next"}
            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-all duration-300" />
          </Button>
        </div> */}
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
            link={true}
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
        <div className="px-4 border-t border-border flex items-center justify-end">
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
