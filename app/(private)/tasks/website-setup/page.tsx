"use client";

import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, ChevronLeft, ChevronRight, Info } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { OnboardingHeader } from "../business-information/page";
import { LinkAdder } from "../components/link-adder";
import { SeoSuggestions } from "../components/seo-suggestions";
import { TagInput } from "../components/tag-input";

const DOMAIN_PROVIDERS = [
  "Strato",
  "GoDaddy",
  "Namecheap",
  "Cloudflare",
  "Google Domains",
  "IONOS",
  "Other",
];

const SEO_CITY_SUGGESTIONS = [
  "Hamburg",
  "Mainz",
  "Dortmund",
  "Leipzig",
  "Munich",
  "Berlin",
  "Cologne",
  "Augsburg",
  "Essen",
  "Stuttgart",
  "Bonn",
  "Hanover",
];

export default function WebsiteSetupPage() {
  const router = useRouter();

  const [accessGranted, setAccessGranted] = useState(false);
  const [domainProvider, setDomainProvider] = useState("");
  const [businessClients, setBusinessClients] = useState<string[]>([]);
  const [legalUpload, setLegalUpload] = useState<string>("");
  const [legalLinks, setLegalLinks] = useState<string[]>([]);
  const [seoLocations, setSeoLocations] = useState<string[]>([]);

  const addUnique = (
    arr: string[],
    value: string,
    setter: (v: string[]) => void
  ) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const exists = arr.some((x) => x.toLowerCase() === trimmed.toLowerCase());
    if (!exists) setter([...arr, trimmed]);
  };
  const removeIndex = (
    arr: string[],
    index: number,
    setter: (v: string[]) => void
  ) => {
    setter(arr.filter((_, i) => i !== index));
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const handleFileClick = () => fileInputRef.current?.click();
  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setLegalUpload("");
      return;
    }
    const names = Array.from(files).map((f) => f.name);
    setLegalUpload(names.join(", "));
  };

  const onNext = () => {
    router.push("/tasks/tracking-analytics");
  };

  return (
    <div className="flex flex-col gap-6 ">
      <SiteHeader>
        <OnboardingHeader />
      </SiteHeader>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-balance">Onboarding Setup</h1>
        <p className="text-muted-foreground">
          Complete the required steps to ensure a smooth and successful project
          launch.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="flex flex-col gap-4">
          <div className="space-y-0">
            <h2 className="font-semibold text-foreground">3. Website Setup</h2>
            <p className="text-sm text-muted-foreground">
              Grant access for website configuration.
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

        <div className="lg:col-span-2 bg-card rounded border p-4 sm:p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="domainProvider" className="text-muted-foreground">
                Domain provider *
              </Label>
              <Info className="w-4 h-4 text-muted-foreground" />
            </div>

            <div className="flex items-center justify-between gap-4">
              <Select value={domainProvider} onValueChange={setDomainProvider}>
                <SelectTrigger id="domainProvider" className="w-full">
                  <SelectValue placeholder="Select domain provider (Fields – Strato, GoDaddy, etc.)" />
                </SelectTrigger>
                <SelectContent>
                  {DOMAIN_PROVIDERS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant={accessGranted ? "default" : "outline"}
                className={`rounded ${accessGranted ? "bg-primary text-primary-foreground" : ""}`}
                onClick={() => setAccessGranted((v) => !v)}
                aria-pressed={accessGranted}
              >
                {accessGranted ? (
                  <>
                    Granted <Check className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  "Grant access"
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <TagInput
              label="Business clients worked "
              placeholder="e.g., Google"
              values={businessClients}
              onAdd={(v) => addUnique(businessClients, v, setBusinessClients)}
              onRemove={(idx) =>
                removeIndex(businessClients, idx, setBusinessClients)
              }
              required
            />
          </div>

          <div className="space-y-3">
            <Label className="text-muted-foreground">
              Upload legal pages or add links *
            </Label>

            <div
              className="border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer border-muted-foreground/25 hover:border-primary/50"
              onClick={handleFileClick}
              role="button"
              aria-label="Upload legal pages"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleFileClick();
                }
              }}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <div className="text-sm">
                  <span className="text-primary cursor-pointer hover:underline">
                    {legalUpload ? "Change file" : "Click to upload"}
                  </span>
                  <span className="text-muted-foreground">
                    {" "}
                    or drag and drop
                  </span>
                </div>
                {legalUpload ? (
                  <p className="text-sm font-medium text-foreground">
                    {legalUpload}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    .docx, .rtf, .pdf, JPG or PNG
                  </p>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".doc,.docx,.rtf,.pdf,image/*"
                  multiple
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="pt-2">
              <LinkAdder
                values={legalLinks}
                onAdd={(url) => addUnique(legalLinks, url, setLegalLinks)}
                onRemove={(idx) => removeIndex(legalLinks, idx, setLegalLinks)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <TagInput
              label="Most important locations for SEO *"
              placeholder="Type a location"
              values={seoLocations}
              onAdd={(v) => addUnique(seoLocations, v, setSeoLocations)}
              onRemove={(idx) =>
                removeIndex(seoLocations, idx, setSeoLocations)
              }
              required
            />

            <p className="text-xs text-muted-foreground">Suggestions</p>
            <SeoSuggestions
              suggestions={SEO_CITY_SUGGESTIONS}
              onPick={(city) => addUnique(seoLocations, city, setSeoLocations)}
            />
          </div>

          {/* Navigation */}
          <div className="flex p-2 pt-4 gap-2 justify-end border-t">
            <Button
              type="button"
              variant="outline"
              className="rounded bg-transparent cursor-pointer group"
              onClick={() => router.back()}
            >
              <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-all duration-300" />
              Previous
            </Button>

            <Button
              type="button"
              className="rounded bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer group"
              onClick={onNext}
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
