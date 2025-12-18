"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useClientProfile } from "@/hooks/use-client-profile"
import { useParams } from "next/navigation"
import React, { ReactNode, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  BriefcaseBusiness,
  Contact,
  Globe,
  ImageIcon,
  LucideLocate,
  Palette,
  ToolCaseIcon,
  Users,
  Video,
  FileText,
  ExternalLink,
  CheckCircle2,
  XCircle,
  DollarSign,
  MapPin,
  Link as LinkIcon,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react"
import Page from "@/components/base/Page"
import { ACCESS_TOOLS } from "@/form/tools-access"
import Image from "next/image"
import { format } from "date-fns"
import { Separator } from "@/components/ui/separator"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Button } from "@/components/ui/button"

const ClientProfilePage = () => {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useClientProfile(id)
  const [activeTab, setActiveTab] = useState("business-information")

  const user = data?.["user"] || {}
  const businessInfo = data?.["business_info"] || {}
  const brandInfo = data?.["branding_info"] || {}
  const websiteSetup = data?.["website_setup"] || {}
  const toolsAccess = data?.["tools_access"] || {}
  const adsBudget = data?.["ads_budget"] || {}

  if (isLoading) {
    return (
      <Page navURL="clients" title="Client Profile" description="client details">
        <div className="col-span-2 overflow-auto">
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </Page>
    )
  }

  if (
    !isLoading &&
    !user &&
    !businessInfo &&
    !brandInfo &&
    !websiteSetup &&
    !toolsAccess &&
    !adsBudget
  ) {
    return (
      <Page navURL="clients" title="Client Profile" description="client details">
        <div className="col-span-2 overflow-auto">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon"></EmptyMedia>
              <EmptyTitle>No data</EmptyTitle>
              <EmptyDescription>No data found</EmptyDescription>
            </EmptyHeader>
            <EmptyContent></EmptyContent>
          </Empty>
        </div>
      </Page>
    )
  }

  const nameInitials =
    user?.first_name
      ?.split(" ")
      .map((word: string) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "CL"

  return (
    <Page navURL="clients" title="Client Profile" description="client details">
      <div className="col-span-2 overflow-auto">
        <div className="border-none shadow-accent">
          <CardHeader className="pb-4 px-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary">
                  <AvatarImage src={user.first_name} alt={user.first_name} />

                  <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                    {nameInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">
                    {user?.first_name || "N/A"} {user?.last_name || ""}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <p>{user?.email}</p>
                    <Badge className="font-normal">ID: {user?.id}</Badge>
                    {user?.created_at && (
                      <Badge variant="secondary" className="font-normal">
                        Est. {new Date(user.created_at).getFullYear()}
                      </Badge>
                    )}
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="overflow-x-auto">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full h-auto min-h-[44px] bg-accent-foreground/10 border border-primary/20">
                <TabsTrigger value="business-information" className="text-xs md:text-sm">
                  Business Info
                </TabsTrigger>
                <TabsTrigger value="branding-information" className="text-xs md:text-sm">
                  Branding
                </TabsTrigger>
                <TabsTrigger value="ads-budget" className="text-xs md:text-sm">
                  Ads Budget
                </TabsTrigger>
                <TabsTrigger value="tools-access" className="text-xs md:text-sm">
                  Tools Access
                </TabsTrigger>
                <TabsTrigger value="website-setup" className="text-xs md:text-sm">
                  Website Setup
                </TabsTrigger>
              </TabsList>
            </div>

            <CardContent className="py-4 px-0">
              <TabsContent
                value="business-information"
                className="m-0 grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <Card className="gap-2">
                  <CardHeader>
                    <div className="flex gap-2 items-center">
                      <BriefcaseBusiness className="h-5 w-5" /> Company Information
                    </div>
                    <Separator className="inline-block my-2" />
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem label="Company Name" value={businessInfo?.company_name || "—"} />
                    <DetailItem label="Start Year" value={businessInfo?.start_year || "—"} />
                    <DetailItem label="VAT ID" value={businessInfo?.vat_id || "—"} />
                    {businessInfo?.created_at && (
                      <DetailItem
                        label="Created At"
                        value={format(new Date(businessInfo.created_at), "PPP")}
                      />
                    )}
                  </CardContent>
                </Card>
                <Card className="gap-2">
                  <CardHeader>
                    <div className="flex gap-2 items-center">
                      <LucideLocate className="h-5 w-5" /> Address Information
                    </div>
                    <Separator className="inline-block my-2" />
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem
                      label="Address"
                      value={businessInfo?.address || "—"}
                      className="md:col-span-2"
                    />
                    <DetailItem label="Postal Code" value={businessInfo?.postal_code || "—"} />
                    <DetailItem label="City" value={businessInfo?.city || "—"} />
                    <DetailItem label="State" value={businessInfo?.state || "—"} />
                    <DetailItem label="Country" value={businessInfo?.country || "—"} />
                  </CardContent>
                </Card>
                <Card className="gap-2">
                  <CardHeader>
                    <div className="flex gap-2 items-center">
                      <Contact className="h-5 w-5" /> Contact Information+
                    </div>
                    <Separator className="inline-block my-2" />
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem label="Contact Name" value={businessInfo?.contact_name || "—"} />
                    <DetailItem
                      label="Contact Email"
                      value={
                        businessInfo?.contact_email ? (
                          <a
                            href={`mailto:${businessInfo.contact_email}`}
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            {businessInfo.contact_email}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          "—"
                        )
                      }
                    />
                    <DetailItem
                      label="Contact Number"
                      value={
                        businessInfo?.contact_number ? (
                          <a
                            href={`tel:${businessInfo.contact_number}`}
                            className="text-primary hover:underline"
                          >
                            {businessInfo.contact_number}
                          </a>
                        ) : (
                          "—"
                        )
                      }
                    />
                    <DetailItem
                      label="WhatsApp Number"
                      value={
                        businessInfo?.whatsapp_number ? (
                          <a
                            href={`https://wa.me/${businessInfo.whatsapp_number.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            {businessInfo.whatsapp_number}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          "—"
                        )
                      }
                    />
                  </CardContent>
                </Card>
                <Card className="gap-2">
                  <CardHeader>
                    <div className="flex gap-2 items-center">
                      <Globe className="h-5 w-5" /> Website & Social Media
                    </div>
                    <Separator className="inline-block my-2" />
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem
                      label="Website"
                      value={
                        businessInfo?.website ? (
                          <a
                            href={businessInfo.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            {businessInfo.website}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          "—"
                        )
                      }
                    />
                    <DetailItem
                      label="Facebook"
                      value={
                        businessInfo?.facebook ? (
                          <a
                            href={businessInfo.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            <Facebook className="h-4 w-4 mr-1" />
                            {businessInfo.facebook}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          "—"
                        )
                      }
                    />
                    <DetailItem
                      label="Instagram"
                      value={
                        businessInfo?.instagram ? (
                          <a
                            href={businessInfo.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            <Instagram className="h-4 w-4 mr-1" />
                            {businessInfo.instagram}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          "—"
                        )
                      }
                    />
                    <DetailItem
                      label="X (Twitter)"
                      value={
                        businessInfo?.x ? (
                          <a
                            href={businessInfo.x}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            <Twitter className="h-4 w-4 mr-1" />
                            {businessInfo.x}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          "—"
                        )
                      }
                    />
                    <DetailItem
                      label="Google Business Profile"
                      value={
                        businessInfo?.google_business_profile_link ? (
                          <a
                            href={businessInfo.google_business_profile_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            {businessInfo.google_business_profile_link}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          "—"
                        )
                      }
                      className="md:col-span-2"
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent
                value="branding-information"
                className="m-0 grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {/* Brand Identity */}
                <Card className="gap-2">
                  <CardHeader>
                    <div className="flex gap-2 items-center">
                      <Palette className="h-5 w-5" />
                      Brand Identity
                    </div>
                    <Separator className="inline-block my-2" />
                  </CardHeader>

                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem
                      label="Font Link"
                      value={
                        brandInfo?.font_link ? (
                          <a
                            href={brandInfo.font_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            {brandInfo.font_link}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          "—"
                        )
                      }
                      className="md:col-span-2"
                    />

                    <DetailItem
                      label="Primary Brand Color"
                      value={
                        brandInfo?.primary_brand_color ? (
                          <div className="flex items-center gap-2">
                            <div
                              className="h-6 w-6 rounded border-2 border-border shadow-sm"
                              style={{ backgroundColor: brandInfo.primary_brand_color }}
                            />
                            <span className="font-mono text-sm">
                              {brandInfo.primary_brand_color}
                            </span>
                          </div>
                        ) : (
                          "—"
                        )
                      }
                    />

                    <DetailItem
                      label="Secondary Brand Color"
                      value={
                        brandInfo?.secondary_brand_color ? (
                          <div className="flex items-center gap-2">
                            <div
                              className="h-6 w-6 rounded border-2 border-border shadow-sm"
                              style={{ backgroundColor: brandInfo.secondary_brand_color }}
                            />
                            <span className="font-mono text-sm">
                              {brandInfo.secondary_brand_color}
                            </span>
                          </div>
                        ) : (
                          "—"
                        )
                      }
                    />
                  </CardContent>
                </Card>

                {/* Brand Assets */}
                <Card className="gap-2">
                  <CardHeader>
                    <div className="flex gap-2 items-center">
                      <ImageIcon className="h-5 w-5" />
                      Brand Assets
                    </div>

                    <Separator className="inline-block my-2" />
                  </CardHeader>

                  <CardContent className="grid grid-cols-1 gap-4">
                    <DetailItem
                      label="Company Logo"
                      value={
                        brandInfo?.logo_url ? (
                          <div className="flex items-center gap-4">
                            <Image
                              src={brandInfo.logo_url}
                              alt="Company Logo"
                              width={80}
                              height={80}
                              className="rounded-lg border object-contain bg-muted p-2"
                            />
                            <a
                              href={brandInfo.logo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center gap-1 text-sm"
                            >
                              View Full Size
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        ) : (
                          "—"
                        )
                      }
                    />

                    <DetailItem
                      label="Team Photos"
                      value={
                        brandInfo?.team_photo_urls?.length ? (
                          <div className="flex flex-wrap gap-3">
                            {brandInfo.team_photo_urls.map((img: string, index: number) => (
                              <div key={index} className="relative group">
                                <Image
                                  src={img}
                                  alt={`Team Photo ${index + 1}`}
                                  width={80}
                                  height={80}
                                  className="rounded-lg border object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                />
                                <a
                                  href={img}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                                >
                                  <ExternalLink className="h-4 w-4 text-white" />
                                </a>
                              </div>
                            ))}
                          </div>
                        ) : (
                          "—"
                        )
                      }
                    />
                  </CardContent>
                </Card>

                {/* Team Information */}
                <Card className="md:col-span-2 gap-2">
                  <CardHeader>
                    <div className="flex gap-2 items-center">
                      <Users className="h-5 w-5" />
                      Team Information
                    </div>
                    <Separator className="inline-block my-2" />
                  </CardHeader>

                  <CardContent>
                    {brandInfo?.team_members?.length ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {brandInfo.team_members.map(
                          (member: { name: string; position: string }, index: number) => (
                            <div
                              key={index}
                              className="rounded-lg border p-4 bg-muted/50 hover:bg-muted transition-colors"
                            >
                              <div className="space-y-1">
                                <p className="font-medium">{member.name || "—"}</p>
                                <p className="text-sm text-muted-foreground">
                                  {member.position || "—"}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">No team members added</span>
                    )}
                  </CardContent>
                </Card>

                {/* CEO Video */}
                <Card className="gap-2">
                  <CardHeader>
                    <div className="flex gap-2 items-center">
                      <Video className="h-5 w-5" />
                      CEO Introduction Video
                    </div>
                    <Separator className="inline-block my-2" />
                  </CardHeader>

                  <CardContent>
                    {brandInfo?.ceo_video_url ? (
                      <div className="rounded-lg border overflow-hidden bg-black">
                        <video
                          src={brandInfo.ceo_video_url}
                          controls
                          className="w-full max-h-[500px]"
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">No CEO video uploaded</span>
                    )}
                  </CardContent>
                </Card>

                {/* Testimonials Video */}
                <Card className="gap-2">
                  <CardHeader>
                    <div className="flex gap-2 items-center">
                      <Video className="h-5 w-5" />
                      Video Testimonials
                    </div>
                    <Separator className="inline-block my-2" />
                  </CardHeader>

                  <CardContent>
                    {brandInfo?.video_testimonial_url ? (
                      <div className="rounded-lg border overflow-hidden bg-black">
                        <video
                          src={brandInfo.video_testimonial_url}
                          controls
                          className="w-full max-h-[500px]"
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        No testimonial video uploaded
                      </span>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent
                value="ads-budget"
                className="m-0 grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <Card className="md:col-span-2 gap-2">
                  <CardHeader>
                    <div className="flex gap-2 items-center">
                      <DollarSign className="h-5 w-5" />
                      Advertising Budget
                    </div>
                    <Separator className="inline-block my-2" />
                  </CardHeader>

                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem
                      label="Monthly Budget"
                      value={
                        adsBudget?.budget ? (
                          <span className="text-lg font-semibold">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: adsBudget.currency || "USD",
                            }).format(adsBudget.budget)}
                          </span>
                        ) : (
                          "—"
                        )
                      }
                    />
                    <DetailItem label="Currency" value={adsBudget?.currency || "—"} />
                    {adsBudget?.created_at && (
                      <DetailItem
                        label="Created At"
                        value={format(new Date(adsBudget.created_at), "PPP")}
                      />
                    )}
                    {adsBudget?.updated_at && (
                      <DetailItem
                        label="Last Updated"
                        value={format(new Date(adsBudget.updated_at), "PPP")}
                      />
                    )}
                  </CardContent>
                </Card>

                <Card className="md:col-span-2 gap-2">
                  <CardHeader>
                    <div className="flex gap-2 items-center">
                      <MapPin className="h-5 w-5" />
                      SEO Locations
                    </div>
                    <Separator className="inline-block my-2" />
                  </CardHeader>

                  <CardContent>
                    {adsBudget?.seo_locations?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {adsBudget.seo_locations.map((location: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-sm">
                            {location}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        No SEO locations specified
                      </span>
                    )}
                  </CardContent>
                </Card>

                <Card className="md:col-span-2 gap-2">
                  <CardHeader>
                    <div className="flex gap-2 items-center">
                      <BriefcaseBusiness className="h-5 w-5" />
                      Services Provided
                    </div>
                    <Separator className="inline-block my-2" />
                  </CardHeader>

                  <CardContent>
                    {adsBudget?.services_provided?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {adsBudget.services_provided.map((service: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-sm">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">No services specified</span>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent
                value="tools-access"
                className="m-0 grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <Card className="md:col-span-2 gap-2">
                  <CardHeader>
                    <div className="flex gap-2 items-center">
                      <ToolCaseIcon className="h-5 w-5" />
                      Tools Access
                    </div>
                    <Separator className="inline-block my-2" />
                  </CardHeader>

                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {ACCESS_TOOLS?.map((tool) => {
                        const hasAccess = toolsAccess?.[tool?.key] || false
                        return (
                          <div
                            key={tool.key}
                            className="flex items-center justify-between p-4 rounded-lg border bg-muted/50 hover:bg-muted transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {tool.icon && (
                                <Image
                                  src={tool.icon}
                                  alt={tool.title}
                                  width={32}
                                  height={32}
                                  className="object-contain"
                                />
                              )}
                              <span className="font-medium">{tool.title}</span>
                            </div>
                            {hasAccess ? (
                              <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Granted
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <XCircle className="h-3 w-3 mr-1" />
                                Not Granted
                              </Badge>
                            )}
                          </div>
                        )
                      })}
                    </div>
                    {toolsAccess?.created_at && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <DetailItem
                            label="Created At"
                            value={format(new Date(toolsAccess.created_at), "PPP")}
                          />
                          {toolsAccess?.updated_at && (
                            <DetailItem
                              label="Last Updated"
                              value={format(new Date(toolsAccess.updated_at), "PPP")}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent
                value="website-setup"
                className="m-0 grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <Card className="md:col-span-2 gap-2">
                  <CardHeader>
                    <div className="flex gap-2 items-center">
                      <Globe className="h-5 w-5" />
                      Website Setup
                    </div>
                    <Separator className="inline-block my-2" />
                  </CardHeader>

                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem
                      label="Domain Provider"
                      value={websiteSetup?.domain_provider || "—"}
                    />
                    <DetailItem
                      label="Access Granted"
                      value={
                        websiteSetup?.access_granted ? (
                          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Yes
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <XCircle className="h-3 w-3 mr-1" />
                            No
                          </Badge>
                        )
                      }
                    />
                    {websiteSetup?.created_at && (
                      <DetailItem
                        label="Created At"
                        value={format(new Date(websiteSetup.created_at), "PPP")}
                      />
                    )}
                    {websiteSetup?.updated_at && (
                      <DetailItem
                        label="Last Updated"
                        value={format(new Date(websiteSetup.updated_at), "PPP")}
                      />
                    )}
                  </CardContent>
                </Card>

                <Card className="md:col-span-2 gap-2">
                  <CardHeader>
                    <div className="flex gap-2 items-center">
                      <MapPin className="h-5 w-5" />
                      SEO Locations
                    </div>
                    <Separator className="inline-block my-2" />
                  </CardHeader>

                  <CardContent>
                    {websiteSetup?.seo_locations?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {websiteSetup.seo_locations.map((location: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-sm">
                            {location}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        No SEO locations specified
                      </span>
                    )}
                  </CardContent>
                </Card>

                <Card className="md:col-span-2 gap-2">
                  <CardHeader>
                    <div className="flex gap-2 items-center">
                      <BriefcaseBusiness className="h-5 w-5" />
                      Business Clients Worked With
                    </div>
                    <Separator className="inline-block my-2" />
                  </CardHeader>

                  <CardContent>
                    {websiteSetup?.business_clients_worked?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {websiteSetup.business_clients_worked.map(
                          (client: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-sm">
                              {client}
                            </Badge>
                          )
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        No business clients specified
                      </span>
                    )}
                  </CardContent>
                </Card>

                <Card className="md:col-span-2 gap-2">
                  <CardHeader>
                    <div className="flex gap-2 items-center">
                      <LinkIcon className="h-5 w-5" />
                      Legal Links
                    </div>
                    <Separator className="inline-block my-2" />
                  </CardHeader>

                  <CardContent>
                    {websiteSetup?.legal_links?.length ? (
                      <div className="space-y-2">
                        {websiteSetup.legal_links.map((link: string, index: number) => (
                          <a
                            key={index}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary hover:underline p-2 rounded border hover:bg-muted transition-colors"
                          >
                            <FileText className="h-4 w-4" />
                            <span className="text-sm break-all">{link}</span>
                            <ExternalLink className="h-3 w-3 ml-auto flex-shrink-0" />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">No legal links added</span>
                    )}
                  </CardContent>
                </Card>

                <Card className="md:col-span-2 gap-2">
                  <CardHeader>
                    <div className="flex gap-2 items-center">
                      <FileText className="h-5 w-5" />
                      Legal Files
                    </div>
                    <Separator className="inline-block my-2" />
                  </CardHeader>

                  <CardContent>
                    {websiteSetup?.legal_files?.length ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {websiteSetup.legal_files.map((fileUrl: string, index: number) => (
                          <a
                            key={index}
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors group"
                          >
                            <FileText className="h-8 w-8 text-primary" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                Legal Document {index + 1}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                PDF Document
                              </p>
                            </div>
                            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        No legal files uploaded
                      </span>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </CardContent>
          </Tabs>
        </div>
      </div>
    </Page>
  )
}

const DetailItem = ({
  label,
  value,
  className = "",
}: {
  label: string | ReactNode
  value: string | ReactNode
  className?: string
}) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <div className="text-sm text-foreground">{value || "—"}</div>
  </div>
)

export default ClientProfilePage
