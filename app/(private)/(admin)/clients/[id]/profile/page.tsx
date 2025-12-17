"use client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useClientProfile } from "@/hooks/use-client-profile"
import { useParams } from "next/navigation"
import React, { ReactNode, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  BriefcaseBusiness,
  Building2,
  Calendar,
  Contact,
  Globe,
  ImageIcon,
  LocateIcon,
  LucideLocate,
  Palette,
  ToolCaseIcon,
  Users,
} from "lucide-react"
import Page from "@/components/base/Page"
import { ACCESS_TOOLS } from "@/form/tools-access"
import Image from "next/image"

const ClientProfilePage = () => {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useClientProfile(id)
  const [activeTab, setActiveTab] = useState("business-information")

  const businessInfo = data?.["business_information"] || {}
  const brandInfo = data?.["branding_information"] || {}
  const websiteSetup = data?.["website_setup"] || {}
  const toolsAccess = data?.["tools_access"] || {}
  const adsBudget = data?.["ads_budget"] || {}

  return (
    <Page navURL="clients" title="Client Profile" description="client details">
      <div className="col-span-2  overflow-auto">
        <div className="border-none shadow-accent ">
          <CardHeader className="pb-4 px-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary">
                  <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                    s
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl"></CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Badge variant="outline" className="font-normal">
                      ID: {data.employee_id}
                    </Badge>
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
            <div className="">
              <TabsList className="grid grid-cols-3 md:grid-cols-7 w-full h-11">
                <TabsTrigger value="business-information">Business Information</TabsTrigger>
                <TabsTrigger value="branding-information">Branding Information</TabsTrigger>
                <TabsTrigger value="ads-budget">Ads Budget</TabsTrigger>
                <TabsTrigger value="tools-access">tools Access</TabsTrigger>
                <TabsTrigger value="website-setup">website Setup</TabsTrigger>
              </TabsList>
            </div>

            <CardContent className="pt-4 px-0 ">
              <TabsContent value="business-information" className="m-0 grid grid-cols-2 gap-4">
                <Card className="gap-2">
                  <CardHeader className="flex gap-2 items-center">
                    <BriefcaseBusiness className="inline-block" /> Company Information
                  </CardHeader>
                  <CardContent className="grid grid-cols-2">
                    <DetailItem label={"Company Name"} value={businessInfo?.company_name} />
                    <DetailItem label={"Start Year"} value={businessInfo?.start_year} />
                    <DetailItem label={"Vat Id Year"} value={businessInfo?.vat_id} />
                  </CardContent>
                </Card>
                <Card className="gap-2">
                  <CardHeader className="flex gap-2 items-center">
                    <LucideLocate className="inline-block" /> Address Information
                  </CardHeader>
                  <CardContent className="grid grid-cols-2">
                    <DetailItem label={"Street Address"} value={businessInfo?.street_address} />
                    <DetailItem label={"Postal Code"} value={businessInfo?.postal_code} />
                    <DetailItem label={"City"} value={businessInfo?.city} />
                    <DetailItem label={"State"} value={businessInfo?.state} />
                    <DetailItem label={"Country"} value={businessInfo?.country} />
                  </CardContent>
                </Card>
                <Card className="gap-2">
                  <CardHeader className="flex gap-2 items-center">
                    <Contact className="inline-block" /> Contact Information
                  </CardHeader>
                  <CardContent className="grid grid-cols-2">
                    <DetailItem label={"Contact Name"} value={businessInfo?.contact_name} />
                    <DetailItem label={"Contact Email"} value={businessInfo?.contact_email} />
                    <DetailItem label={"Contact Number"} value={businessInfo?.contact_number} />
                    <DetailItem label={"Whatsapp Number"} value={businessInfo?.whatsapp_number} />
                  </CardContent>
                </Card>
                <Card className="gap-2">
                  <CardHeader className="flex gap-2 items-center">
                    <Globe className="inline-block" /> Website & Social Media
                  </CardHeader>
                  <CardContent className="grid grid-cols-2">
                    <DetailItem label={"Website"} value={businessInfo?.website} />
                    <DetailItem label={"Facebook"} value={businessInfo?.facebook} />
                    <DetailItem label={"X"} value={businessInfo?.x} />
                    <DetailItem
                      label={"Google Business Profile Link"}
                      value={businessInfo?.google_business_profile_link}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="branding-information" className="m-0 grid grid-cols-2 gap-4">
                {/* Brand Identity */}
                <Card className="gap-2">
                  <CardHeader className="flex gap-2 items-center">
                    <Palette className="inline-block" />
                    Brand Identity
                  </CardHeader>

                  <CardContent className="grid grid-cols-2 gap-4">
                    <DetailItem label="Font Link" value={brandInfo?.font_link} />

                    <DetailItem
                      label="Primary Brand Color"
                      value={
                        <div className="flex items-center gap-2">
                          <div
                            className="h-4 w-4 rounded border"
                            style={{ backgroundColor: brandInfo?.primary_color }}
                          />
                          <span>{brandInfo?.primary_color}</span>
                        </div>
                      }
                    />

                    <DetailItem
                      label="Secondary Brand Color"
                      value={
                        <div className="flex items-center gap-2">
                          <div
                            className="h-4 w-4 rounded border"
                            style={{ backgroundColor: brandInfo?.secondary_color }}
                          />
                          <span>{brandInfo?.secondary_color}</span>
                        </div>
                      }
                    />
                  </CardContent>
                </Card>

                {/* Brand Assets */}
                <Card className="gap-2">
                  <CardHeader className="flex gap-2 items-center">
                    <ImageIcon className="inline-block" />
                    Brand Assets
                  </CardHeader>

                  <CardContent className="grid grid-cols-2 gap-4">
                    <DetailItem
                      label="Company Logo"
                      value={
                        brandInfo?.logo_url ? (
                          <img
                            src={brandInfo.logo_url}
                            alt="Company Logo"
                            className="h-16 rounded border"
                          />
                        ) : (
                          "—"
                        )
                      }
                    />

                    <DetailItem
                      label="Team Photos"
                      value={
                        <div className="flex gap-2">
                          {brandInfo?.team_photos?.length
                            ? brandInfo.team_photos.map((img: string, index: number) => (
                                <img
                                  key={index}
                                  src={img}
                                  alt="Team"
                                  className="h-12 w-12 rounded border object-cover"
                                />
                              ))
                            : "—"}
                        </div>
                      }
                    />
                  </CardContent>
                </Card>

                {/* Team Information */}
                <Card className="col-span-2 gap-2">
                  <CardHeader className="flex gap-2 items-center">
                    <Users className="inline-block" />
                    Team Information
                  </CardHeader>

                  <CardContent className="grid grid-cols-2 gap-4">
                    {brandInfo?.team_members?.length ? (
                      brandInfo.team_members?.map(
                        (member: { name: string; position: string }, index: number) => (
                          <div key={index} className="rounded border p-3 grid grid-cols-2 gap-2">
                            <DetailItem label="Name" value={member.name} />
                            <DetailItem label="Position" value={member.position} />
                          </div>
                        )
                      )
                    ) : (
                      <span className="text-sm text-muted-foreground">No team members added</span>
                    )}
                  </CardContent>
                </Card>

                {/* Ceo  Video */}
                <Card className="gap-2">
                  <CardHeader className="flex gap-2 items-center">
                    <Users className="inline-block" />
                    Ceo Video
                  </CardHeader>

                  <CardContent className="grid grid-cols-2 gap-4">
                    <video src={brandInfo?.ceo_video} />
                  </CardContent>
                </Card>

                {/* Tetsimonials  Video */}
                <Card className="gap-2">
                  <CardHeader className="flex gap-2 items-center">
                    <Users className="inline-block" />
                    Testimonials Video
                  </CardHeader>

                  <CardContent className="grid grid-cols-2 gap-4">
                    <video src={brandInfo?.video_testimonial} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ads-budget" className="m-0 grid grid-cols-2 gap-4">
                {/* Brand Identity */}
                <Card className="col-span-2 gap-2">
                  <CardHeader className="flex gap-2 items-center">
                    <Palette className="inline-block" />
                    Budget
                  </CardHeader>

                  <CardContent className="grid grid-cols-2 gap-4">
                    <DetailItem label="Monthly Budget" value={websiteSetup?.monthly_budget} />
                    <DetailItem
                      label="Business Clients Worked"
                      value={
                        websiteSetup?.business_clients_worked?.length ? (
                          websiteSetup.business_clients_worked?.map(
                            (seo: string, index: number) => (
                              <div
                                key={index}
                                className="rounded border p-3 grid grid-cols-2 gap-2"
                              >
                                <p>{seo}</p>
                              </div>
                            )
                          )
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            No business clients worked
                          </span>
                        )
                      }
                    />
                    <DetailItem
                      label="Legal Links"
                      value={
                        websiteSetup?.legal_links?.length ? (
                          websiteSetup.legal_links?.map((seo: string, index: number) => (
                            <div key={index} className="rounded border p-3 grid grid-cols-2 gap-2">
                              <p>{seo}</p>
                            </div>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">No Legal Links</span>
                        )
                      }
                    />
                    <DetailItem
                      label="Legal Files"
                      value={
                        websiteSetup?.legal_files?.length ? (
                          websiteSetup.legal_files?.map((seo: string, index: number) => (
                            <div key={index} className="rounded border p-3 grid grid-cols-2 gap-2">
                              <Image src={seo} alt="Company Logo" className="h-16 rounded border" />
                            </div>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">No Legal Files</span>
                        )
                      }
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tools-access" className="m-0 grid grid-cols-2 gap-4">
                {" "}
                {/* Brand Identity */}
                <Card className="col-span-2 gap-2">
                  <CardHeader className="flex gap-2 items-center">
                    <ToolCaseIcon className="inline-block" />
                    Tools
                  </CardHeader>

                  <CardContent className="grid grid-cols-2 gap-4">
                    {ACCESS_TOOLS?.map((tool) => {
                      const val = toolsAccess?.[tool?.key] ? "True" : ("False" as string)
                      return <DetailItem label={tool?.title} value={val} key={tool.key} />
                    })}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="website-setup" className="m-0 grid grid-cols-2 gap-4">
                {/* Brand Identity */}
                <Card className="col-span-2 gap-2">
                  <CardHeader className="flex gap-2 items-center">
                    <Globe className="inline-block" />
                    Website
                  </CardHeader>

                  <CardContent className="grid grid-cols-2 gap-4">
                    <DetailItem label="domain_provider" value={websiteSetup?.domain_provider} />
                    <DetailItem label="Currency" value={websiteSetup?.currency} />
                    <DetailItem
                      label="business_clients_worked"
                      value={
                        brandInfo?.seo_locations?.length ? (
                          brandInfo.seo_locations?.map((seo: string, index: number) => (
                            <div key={index} className="rounded border p-3 grid grid-cols-2 gap-2">
                              <p>{seo}</p>
                            </div>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">No Seo Location</span>
                        )
                      }
                    />
                    <DetailItem
                      label="Services Provided"
                      value={
                        brandInfo?.services_provided?.length ? (
                          brandInfo.services_provided?.map((seo: string, index: number) => (
                            <div key={index} className="rounded border p-3 grid grid-cols-2 gap-2">
                              <p>{seo}</p>
                            </div>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            No Services Provided
                          </span>
                        )
                      }
                    />
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

const DetailItem = ({ label, value }: { label: string | ReactNode; value: string | ReactNode }) => (
  <div className="flex flex-col gap-1">
    <p className="text-sm text-foreground/80">{label}</p>
    <p className="text-sm">{value}</p>
  </div>
)

export default ClientProfilePage
