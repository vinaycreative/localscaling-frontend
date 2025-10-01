"use client";

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
import { BusinessFormData, BusinessFormSchema } from "@/schema/business-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

const generateYearOptions = (startYear: number, endYear: number) => {
  const years = [];
  for (let year = endYear; year >= startYear; year--) {
    years.push(year.toString());
  }
  return years;
};
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = generateYearOptions(1900, CURRENT_YEAR);

const OnboardingHeader = () => (
  <div className="flex flex-col gap-4">
    <div className="flex gap-2 text-primary items-center cursor-pointer">
      <ArrowLeft className="h-3 w-3" />
      Dashboard
    </div>
  </div>
);

const OnboardingVideo = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="space-y-0">
        <h1 className="font-semibold text-foreground">
          1. General Business Information
        </h1>
        <p className="text-sm text-muted-foreground">
          Provide essential company details
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

function BusinessInformationPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BusinessFormData>({
    resolver: zodResolver(BusinessFormSchema),
    defaultValues: {
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
    },
  });

  const onSubmit: SubmitHandler<BusinessFormData> = (data) => {
    console.log("Form Data Submitted:", data);
    // handle API calls here
    handleNext();
  };

  const handleNext = (): void => {
    router.push("/dashboard/branding-content");
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
          launch
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <OnboardingVideo />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 lg:col-span-2 bg-background p-4 rounded"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2 col-span-3">
                <Label htmlFor="company" className="text-muted-foreground">
                  Company name*
                </Label>
                <Input
                  id="company"
                  type="text"
                  placeholder="Company Name"
                  className="bg-background"
                  {...register("company")}
                />
                {errors.company && (
                  <p className="text-sm text-red-500">
                    {errors.company.message}
                  </p>
                )}
              </div>
              <div className="space-y-2 col-span-1">
                <Label htmlFor="startYear" className="text-muted-foreground">
                  Start year*
                </Label>
                <Select onValueChange={(value) => setValue("startYear", value)}>
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEAR_OPTIONS.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.startYear && (
                  <p className="text-sm text-red-500">
                    {errors.startYear.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="streetAddress" className="text-muted-foreground">
                Street Address*
              </Label>
              <Input
                id="streetAddress"
                type="text"
                placeholder="123 Main St"
                className="bg-background"
                {...register("streetAddress")}
              />
              {errors.streetAddress && (
                <p className="text-sm text-red-500">
                  {errors.streetAddress.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postalCode" className="text-muted-foreground">
                  Postal Code*
                </Label>
                <Input
                  id="postalCode"
                  type="text"
                  placeholder="10001"
                  className="bg-background"
                  {...register("postalCode")}
                />
                {errors.postalCode && (
                  <p className="text-sm text-red-500">
                    {errors.postalCode.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="text-muted-foreground">
                  City*
                </Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="New York"
                  className="bg-background"
                  {...register("city")}
                />
                {errors.city && (
                  <p className="text-sm text-red-500">{errors.city.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state" className="text-muted-foreground">
                  State*
                </Label>
                <Input
                  id="state"
                  type="text"
                  placeholder="NY"
                  className="bg-background"
                  {...register("state")}
                />
                {errors.state && (
                  <p className="text-sm text-red-500">{errors.state.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="text-muted-foreground">
                  Country*
                </Label>
                <Input
                  id="country"
                  type="text"
                  placeholder="USA"
                  className="bg-background"
                  {...register("country")}
                />
                {errors.country && (
                  <p className="text-sm text-red-500">
                    {errors.country.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vatId" className="text-muted-foreground">
                VAT ID*
              </Label>
              <Input
                id="vatId"
                type="text"
                placeholder="DE123456789"
                className="bg-background"
                {...register("vatId")}
              />
              {errors.vatId && (
                <p className="text-sm text-red-500">{errors.vatId.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="contactName" className="text-muted-foreground">
                  Contact name*
                </Label>
                <Input
                  id="contactName"
                  placeholder="Contact Name"
                  className="bg-background"
                  {...register("contactName")}
                />
                {errors.contactName && (
                  <p className="text-sm text-red-500">
                    {errors.contactName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-muted-foreground">
                  Contact email*
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="info@yourcompany.com"
                  className="bg-background"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="contactNumber"
                  className="text-muted-foreground"
                >
                  Contact number*
                </Label>
                <div className="flex">
                  <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
                    <span className="text-sm text-muted-foreground">DE</span>
                  </div>
                  <Input
                    id="contactNumber"
                    placeholder="+1 (555) 000-0000"
                    className="rounded-l-none bg-background"
                    {...register("contactNumber")}
                  />
                </div>
                {errors.contactNumber && (
                  <p className="text-sm text-red-500">
                    {errors.contactNumber.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="whatsappNumber"
                  className="text-muted-foreground"
                >
                  Whatsapp number
                </Label>
                <div className="flex">
                  <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
                    <span className="text-sm text-muted-foreground">DE</span>
                  </div>
                  <Input
                    id="whatsappNumber"
                    placeholder="+44 (555) 000-0000"
                    className="rounded-l-none bg-background"
                    {...register("whatsappNumber")}
                  />
                </div>
                {errors.whatsappNumber && (
                  <p className="text-sm text-red-500">
                    {errors.whatsappNumber.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="website" className="text-muted-foreground">
                Current website
              </Label>
              <div className="flex">
                <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
                  <span className="text-sm text-muted-foreground">
                    https://
                  </span>
                </div>
                <Input
                  id="website"
                  placeholder="www.yoursite.com"
                  className="rounded-l-none bg-background"
                  {...register("website")}
                />
              </div>
              {errors.website && (
                <p className="text-sm text-red-500">{errors.website.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook" className="text-muted-foreground">
                  Facebook link
                </Label>
                <div className="flex">
                  <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
                    <span className="text-sm text-muted-foreground">
                      https://
                    </span>
                  </div>
                  <Input
                    id="facebook"
                    placeholder="www.facebook.com"
                    className="rounded-l-none bg-background"
                    {...register("facebook")}
                  />
                </div>
                {errors.facebook && (
                  <p className="text-sm text-red-500">
                    {errors.facebook.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram" className="text-muted-foreground">
                  Instagram link
                </Label>
                <div className="flex">
                  <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
                    <span className="text-sm text-muted-foreground">
                      https://
                    </span>
                  </div>
                  <Input
                    id="instagram"
                    placeholder="www.instagram.com"
                    className="rounded-l-none bg-background"
                    {...register("instagram")}
                  />
                </div>
                {errors.instagram && (
                  <p className="text-sm text-red-500">
                    {errors.instagram.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter" className="text-muted-foreground">
                  X (Twitter) link
                </Label>
                <div className="flex">
                  <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
                    <span className="text-sm text-muted-foreground">
                      https://
                    </span>
                  </div>
                  <Input
                    id="twitter"
                    placeholder="www.x.com"
                    className="rounded-l-none bg-background"
                    {...register("twitter")}
                  />
                </div>
                {errors.twitter && (
                  <p className="text-sm text-red-500">
                    {errors.twitter.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="googleBusinessProfileLink"
                  className="text-muted-foreground"
                >
                  Google Business Profile link
                </Label>
                <div className="flex">
                  <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
                    <span className="text-sm text-muted-foreground">
                      https://
                    </span>
                  </div>
                  <Input
                    id="googleBusinessProfileLink"
                    placeholder="maps.app.goo.gl/..."
                    className="rounded-l-none bg-background"
                    {...register("googleBusinessProfileLink")}
                  />
                </div>
                {errors.googleBusinessProfileLink && (
                  <p className="text-sm text-red-500">
                    {errors.googleBusinessProfileLink.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex p-2 pt-4 justify-end border-t">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
            >
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BusinessInformationPage;
