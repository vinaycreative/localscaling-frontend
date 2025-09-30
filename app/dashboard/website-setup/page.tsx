"use client";

import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  WebsiteSetupFormData,
  WebsiteSetupSchema,
} from "@/schema/website-setup";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FileUploadArea } from "../components/file-upload-area";

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
    <div className="flex flex-col gap-4">
      <div className="space-y-0">
        <h1 className="font-semibold text-foreground">3. Website Setup</h1>
        <p className="text-sm text-muted-foreground">
          Start access for website configuration.
        </p>
      </div>

      <div className="relative aspect-video bg-muted rounded overflow-hidden">
        <Image
          src="/video.jpg"
          alt="Website setup consultation video"
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

function WebsiteSetupPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    trigger,
  } = useForm<WebsiteSetupFormData>({
    resolver: zodResolver(WebsiteSetupSchema),
    mode: "onBlur",
    defaultValues: {
      contentFiles: "",
      legalPages: "",
    },
  });

  const commonFormProps = {
    register,
    setValue,
    watch,
    trigger,
  };

  const onSubmit: SubmitHandler<WebsiteSetupFormData> = (data) => {
    console.log("Website Setup Submitted:", data);
    setTimeout(() => {
      router.push("/dashboard/tracking-analytics");
    }, 500);
  };

  const handlePrevious = (): void => {
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
          launch.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid lg:grid-cols-3 gap-8"
      >
        <OnboardingVideo />

        <div className="space-y-6 lg:col-span-2 bg-background p-4 rounded">
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-muted-foreground">
                Connect WebFlow Account *
              </Label>
              <Button
                type="button"
                variant={"outline"}
                className={`flex items-center gap-3 px-4 py-2 border font-medium rounded transition-colors 
                `}
              >
                <>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                  >
                    <rect width="20" height="20" fill="currentcolor" />
                  </svg>
                  Connect WebFlow Account
                </>
              </Button>
            </div>

            <div className="space-y-3">
              <Label className="text-muted-foreground">Domain provider *</Label>
              <div className="flex items-center gap-3">
                <Select>
                  <SelectTrigger className={`flex-1 `}>
                    <SelectValue placeholder="Select domain provider (Fields - Strato, GoDaddy, etc.)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strato">Strato</SelectItem>
                    <SelectItem value="godaddy">GoDaddy</SelectItem>
                    <SelectItem value="namecheap">Namecheap</SelectItem>
                    <SelectItem value="cloudflare">Cloudflare</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" type="button">
                  Grant access
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-muted-foreground">Setup email *</Label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="google-workspace" />
                    <Label htmlFor="google-workspace" className="text-sm">
                      Google workspace
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 ml-8">
                    <Checkbox id="microsoft-365" />
                    <Label htmlFor="microsoft-365" className="text-sm">
                      Microsoft 365
                    </Label>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto bg-transparent"
                    type="button"
                  >
                    Grant access
                  </Button>
                </div>
              </div>
            </div>

            <FileUploadArea<WebsiteSetupFormData>
              label="Upload content"
              accept=".docx,.rtf,.pdf,.txt"
              placeholder=".docx, .rtf, .pdf or .txt"
              formProps={{
                ...commonFormProps,
                error: errors.contentFiles,
                name: "contentFiles",
              }}
            />

            <FileUploadArea<WebsiteSetupFormData>
              label="Upload legal pages"
              accept=".docx,.rtf,.pdf,.txt"
              placeholder=".docx, .rtf, .pdf or .txt"
              formProps={{
                ...commonFormProps,
                error: errors.legalPages,
                name: "legalPages",
              }}
            />
          </div>

          <div className="flex p-2 pt-4 gap-2 justify-end border-t">
            <Button
              type="button"
              variant="outline"
              className="rounded bg-transparent cursor-pointer"
              onClick={handlePrevious}
            >
              Previous
            </Button>
            <Button
              type="submit"
              className="rounded bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Next"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default WebsiteSetupPage;
