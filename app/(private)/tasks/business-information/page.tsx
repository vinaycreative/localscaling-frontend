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
import { ArrowLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import ErrorMessage from "../components/error-message";

const generateYearOptions = (startYear: number, endYear: number) => {
  const years = [];
  for (let year = endYear; year >= startYear; year--) {
    years.push(year.toString());
  }
  return years;
};
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = generateYearOptions(1900, CURRENT_YEAR);

export const OnboardingHeader = () => (
  <div className="flex flex-col gap-4">
    <div className="flex gap-2 text-primary items-center cursor-pointer group">
      <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-all duration-300" />
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

      <div className="flex flex-col">
        <h2 className="text-balance text-3xl font-bold">Onboarding Setup</h2>
        <p className="text-pretty text-muted-foreground">
          Complete the required steps to ensure a smooth and successful project
          launch.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <OnboardingVideo />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 lg:col-span-2 bg-background p-4 rounded"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2 col-span-3">
                <Label htmlFor="company">
                  Company name <span className="text-primary">*</span>
                </Label>
                <Input
                  id="company"
                  type="text"
                  placeholder="Company Name"
                  className="bg-background rounded focus-visible:ring-[0spx]"
                  {...register("company")}
                />
                <ErrorMessage message={errors.company?.message} />
              </div>
              <div className="space-y-2 col-span-1">
                <Label htmlFor="startYear">
                  Start year <span className="text-primary">*</span>
                </Label>
                <Select onValueChange={(value) => setValue("startYear", value)}>
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
                <ErrorMessage message={errors.startYear?.message} />
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
                className="bg-background rounded focus-visible:ring-[0spx]"
                {...register("streetAddress")}
              />
              <ErrorMessage message={errors.streetAddress?.message} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postalCode">
                  Postal Code <span className="text-primary">*</span>
                </Label>
                <Input
                  id="postalCode"
                  type="text"
                  placeholder="10001"
                  className="bg-background rounded focus-visible:ring-[0spx]"
                  {...register("postalCode")}
                />
                <ErrorMessage message={errors.postalCode?.message} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">
                  City<span className="text-primary">*</span>
                </Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="New York"
                  className="bg-background rounded focus-visible:ring-[0spx]"
                  {...register("city")}
                />
                <ErrorMessage message={errors.city?.message} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state">
                  State<span className="text-primary">*</span>
                </Label>
                <Input
                  id="state"
                  type="text"
                  placeholder="NY"
                  className="bg-background rounded focus-visible:ring-[0spx]"
                  {...register("state")}
                />
                <ErrorMessage message={errors.state?.message} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">
                  Country<span className="text-primary">*</span>
                </Label>
                <Input
                  id="country"
                  type="text"
                  placeholder="USA"
                  className="bg-background rounded focus-visible:ring-[0spx]"
                  {...register("country")}
                />
                <ErrorMessage message={errors.country?.message} />
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
                className="bg-background rounded focus-visible:ring-[0spx]"
                {...register("vatId")}
              />
              <ErrorMessage message={errors.vatId?.message} />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">
                  Contact name<span className="text-primary">*</span>
                </Label>
                <Input
                  id="contactName"
                  placeholder="Contact Name"
                  className="bg-background rounded focus-visible:ring-[0spx]"
                  {...register("contactName")}
                />
                <ErrorMessage message={errors.contactName?.message} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  Contact email<span className="text-primary">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="info@yourcompany.com"
                  className="bg-background rounded focus-visible:ring-[0spx]"
                  {...register("email")}
                />
                <ErrorMessage message={errors.email?.message} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                    className="bg-background rounded rounded-l-none focus-visible:ring-[0spx]"
                    {...register("contactNumber")}
                  />
                </div>
                <ErrorMessage message={errors.contactNumber?.message} />
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
                    {...register("whatsappNumber")}
                  />
                </div>
                <ErrorMessage message={errors.whatsappNumber?.message} />
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="website">Current website</Label>
              <div className="flex">
                <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l">
                  <span className="text-sm text-muted-foreground">
                    https://
                  </span>
                </div>
                <Input
                  id="website"
                  placeholder="www.yoursite.com"
                  className="bg-background rounded rounded-l-none focus-visible:ring-[0spx]"
                  {...register("website")}
                />
              </div>
              <ErrorMessage message={errors.website?.message} />
            </div>

            <div className="space-y-4">
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
                    className="bg-background rounded rounded-l-none focus-visible:ring-[0spx]"
                    {...register("facebook")}
                  />
                </div>
                <ErrorMessage message={errors.facebook?.message} />
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
                    className="bg-background rounded rounded-l-none focus-visible:ring-[0spx]"
                    {...register("instagram")}
                  />
                </div>
                <ErrorMessage message={errors.instagram?.message} />
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
                    className="bg-background rounded rounded-l-none focus-visible:ring-[0spx]"
                    {...register("twitter")}
                  />
                </div>
                <ErrorMessage message={errors.twitter?.message} />
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
                    className="bg-background rounded rounded-l-none focus-visible:ring-[0spx]"
                    {...register("googleBusinessProfileLink")}
                  />
                </div>
                <ErrorMessage
                  message={errors.googleBusinessProfileLink?.message}
                />
              </div>
            </div>
          </div>

          <div className="flex p-2 pt-4 justify-end border-t">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded group bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-all duration-300" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BusinessInformationPage;
