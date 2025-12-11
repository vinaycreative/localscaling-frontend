"use client"

import BrandAssetUploader from "@/components/reusable/brand-asset-uploader"
import ColorPickerInput from "@/components/reusable/color-picker"
import { CustomInput } from "@/components/reusable/custom-input"
import OnboardingVideo from "@/components/reusable/onboarding-video"
import { VideoUpload } from "@/components/reusable/video-upload"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  BrandingContentFormData,
  BrandingInfoPayload,
} from "@/interfaces/onboarding/branding-content"
import { uploadFileToStorage } from "@/lib/storage"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { TeamMemberList } from "./components/member-entry-list"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useBrandingInfo, useCreateBrandingInfo } from "@/hooks/use-branding-info"
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormControl,
  FormLabel,
} from "@/components/ui/form"

const BrandingSchema = z.object({
  font_link: z.string().min(1, "Font link is required"),
  primary_brand_color: z.string(),
  secondary_brand_color: z.string(),
  logo_file: z.any().nullable(),
  team_photos: z.any().nullable(),
  team_members: z.array(
    z.object({
      name: z.string().min(1, "Name required"),
      position: z.string().min(1, "Position required"),
    })
  ),
  video_creation_option: z.enum(["upload", "studio", "remote"]),
  ceo_video: z.any().nullable(),
  video_testimonial: z.any().nullable(),
})

const initialFormData: BrandingContentFormData = {
  font_link: "",
  primary_brand_color: "#007BFF",
  secondary_brand_color: "#6C757D",
  logo_file: null,
  team_photos: null,
  team_members: [{ name: "", position: "" }],
  video_creation_option: "upload",
  ceo_video: null,
  video_testimonial: null,
}

const urlToFile = async (url: string, filename: string, mimeType: string): Promise<File> => {
  if (!url) return new File([], filename)
  try {
    const res = await fetch(url)
    const blob = await res.blob()
    return new File([blob], filename, { type: mimeType })
  } catch (e) {
    console.error("Error converting URL to File:", e)
    return new File([], filename)
  }
}

function BrandingContentPage() {
  const router = useRouter()

  const {
    data: brandingInfoData,
    isLoading: brandingInfoLoading,
    error: brandingInfoError,
  } = useBrandingInfo()

  const {
    createBrandingInfo,
    isPending: isSubmitting,
    error: createBrandingInfoError,
  } = useCreateBrandingInfo()

  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  const form = useForm<z.infer<typeof BrandingSchema>>({
    resolver: zodResolver(BrandingSchema),
    defaultValues: initialFormData,
  })

  const {
    formState: { errors },
    watch,
    setValue,
  } = form

  useEffect(() => {
    const loadData = async () => {
      if (brandingInfoData.data) {
        const dbData = brandingInfoData.data

        let logo_file = null
        if (dbData.logoUrl) {
          logo_file = await urlToFile(dbData.logoUrl, "logo.png", "image/png")
        }

        let team_photos: File[] = []
        if (dbData.teamPhotoUrls && Array.isArray(dbData.teamPhotoUrls)) {
          team_photos = await Promise.all(
            dbData.teamPhotoUrls.map((url: string, index: number) =>
              urlToFile(url, `team-${index}.jpg`, "image/jpeg")
            )
          )
        }

        let ceo_video = null
        if (dbData.ceoVideoUrl) {
          ceo_video = await urlToFile(dbData.ceoVideoUrl, "ceo-intro.mp4", "video/mp4")
        }

        let videoTestimonial = null
        if (dbData.videoTestimonialUrl) {
          videoTestimonial = await urlToFile(
            dbData.videoTestimonialUrl,
            "testimonial.mp4",
            "video/mp4"
          )
        }

        Object.keys(initialFormData).forEach((key) => {
          setValue(key as keyof typeof initialFormData, dbData?.[key])
        })
      }
    }

    if (brandingInfoData) {
      loadData()
    }
  }, [brandingInfoData])

  const onSubmit = async (values: BrandingContentFormData) => {
    console.log("🚀 ~ onSubmit ~ values:", values)

    try {
      // LOGO -> branding-assets/logos
      let logo_file = values.logo_file || null
      let logoUrl = ""
      if (logo_file) {
        // Optimization: Skip upload if it's the same file content (simple check would be name/size/type match against saved)
        // For now, we upload to ensure consistency.
        logoUrl = await uploadFileToStorage(logo_file, "branding-assets", "logos")
      }
      // TEAM PHOTOS -> branding-assets/team
      let team_photos: File[] = values.team_photos || []
      let teamPhotoUrls: string[] = []
      if (team_photos && team_photos.length > 0) {
        const uploadPromises = team_photos.map((f) =>
          uploadFileToStorage(f, "branding-assets", "team")
        )
        teamPhotoUrls = await Promise.all(uploadPromises)
      }
      // CEO VIDEO -> videos/ceo-intro
      let ceo_video = values.ceo_video || null
      let ceoVideoUrl = null
      if (ceo_video) {
        ceoVideoUrl = await uploadFileToStorage(ceo_video, "videos", "ceo-intro")
      }
      // TESTIMONIALS -> videos/testimonials
      let videoTestimonial = values.video_testimonial || null
      let videoTestimonialUrl = null
      if (videoTestimonial) {
        videoTestimonialUrl = await uploadFileToStorage(videoTestimonial, "videos", "testimonials")
      }
      const payload: BrandingInfoPayload = {
        font_link: values.font_link,
        primary_brand_color: values.primary_brand_color,
        secondary_brand_color: values.secondary_brand_color,
        logo_url: logoUrl,
        team_photo_urls: teamPhotoUrls,
        team_members: values.team_members,
        video_creation_option: values.video_creation_option,
        ceo_video_url: ceoVideoUrl,
        video_testimonial_url: videoTestimonialUrl,
      }

      await createBrandingInfo(payload)
      toast.success("Branding information saved!")
      router.push("/tasks/website-setup")
    } catch (error) {
      console.error(error)
      toast.error("Failed to save. Please try again.")
    } finally {
    }
  }

  const handleNext = async () => {
    const isValid = await form.trigger()
    console.log("🚀 ~ handleNext ~ isValid:", isValid)

    if (!isValid) {
      toast.error("Please fill all required fields correctly", {
        description: (
          <div className="flex flex-col">
            {Object.entries(form.formState.errors).map(([key, value]) => (
              <div key={key}>
                {key}: {(value as any)?.message}
              </div>
            ))}
          </div>
        ),
      })
      return
    }
    if (currentStep < totalSteps) {
      setCurrentStep((prevStep) => prevStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prevStep) => prevStep - 1)
    } else {
      router.push("/tasks/business-information")
    }
  }

  if (brandingInfoLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <section className="w-full h-full grid lg:grid-cols-[auto_1fr] gap-4 overflow-hidden pt-4">
      <OnboardingVideo
        title={`2.${currentStep} Branding & Content`}
        subTitle="Submit brand assets for a consistent identity."
      />

      <Form {...form}>
        <div className="rounded-lg border-border border bg-background w-full h-full grid grid-rows-[auto_60px] overflow-hidden">
          <form onSubmit={form.handleSubmit(onSubmit)} className="overflow-y-scroll">
            {currentStep === 1 && (
              <div className="p-6 h-full overflow-y-scroll flex flex-col gap-4">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold">Brand Identity</h3>
                  <p className="text-sm text-muted-foreground">
                    Set up your brand colors, fonts, and logo
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="font_link"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <CustomInput
                          label="Font Link"
                          id="font_link"
                          type="text"
                          placeholder="www.fontlink.com"
                          required={true}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="primary_brand_color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Brand Color</FormLabel>
                        <FormControl>
                          <ColorPickerInput value={field.value} onChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="secondary_brand_color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secondary Brand Color</FormLabel>
                        <FormControl>
                          <ColorPickerInput value={field.value} onChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <p className="text-xs text-muted-foreground">
                    Enter a hex code like #3B82F6 or #fff, or pick from the palette.
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="logo_file"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <BrandAssetUploader
                          label="Company Logo"
                          field={field?.name}
                          multiple={false}
                          value={field.value as File}
                          onChange={field.onChange}
                          maxFiles={1}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="team_photos"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <BrandAssetUploader
                          label="Team Photos (Portrait in corporate shirt)"
                          field={field.value}
                          multiple={true}
                          value={field.value}
                          onChange={field.onChange}
                          maxFiles={6}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="team_members"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <TeamMemberList
                          label="Team Members"
                          value={field.value}
                          onChange={field.onChange}
                          addButtonLabel="Add Team Member"
                          minRows={1}
                          required={true}
                          className="mt-4"
                          errors={errors?.team_members}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {currentStep === 2 && (
              <div className="p-6 h-full overflow-y-scroll flex flex-col gap-4">
                <p className="text-muted-foreground italic text-xs">
                  Please watch the entire video, before proceeding with the form.
                </p>

                <FormField
                  control={form.control}
                  name="ceo_video"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <VideoUpload
                          label="CEO introductory video"
                          value={field.value}
                          onChange={field.onChange}
                          required={true}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <p className="text-sm">
                  Do not have an introductory video? Choose how you&apos;d like us to help you
                  create one.
                </p>

                <FormField
                  control={form.control}
                  name="video_creation_option"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Button
                          type="button"
                          variant={"outline"}
                          onClick={() => {
                            field.onChange("studio")
                          }}
                          className={`rounded cursor-pointer transition-all duration-300 w-fit justify-start 
                          ${watch("video_creation_option") === "studio" && "ring-2 ring-primary border-primary bg-accent/20"}
                          `}
                          disabled={!!watch("ceo_video")}
                        >
                          Schedule a Studio Session
                        </Button>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <p className="text-xs text-muted-foreground">
                  Book a slot at our studio to record your professional introduction.
                </p>

                <div className="flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">or</span>
                </div>

                <FormField
                  control={form.control}
                  name="video_creation_option"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Button
                          type="button"
                          variant={"outline"}
                          onClick={() => {
                            field.onChange("remote")
                          }}
                          className={`rounded cursor-pointer transition-all duration-300 w-fit justify-start 
                          ${watch("video_creation_option") === "remote" && "ring-2 ring-primary border-primary bg-accent/20"}
                          `}
                          disabled={!!watch("ceo_video")}
                        >
                          Record Remotely
                        </Button>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  Schedule an online session, our team will guide you over a video call and edit it
                  for you.
                </p>
              </div>
            )}

            {currentStep === 3 && (
              <div className="p-6 h-full overflow-y-scroll flex flex-col gap-4">
                <p className="text-muted-foreground italic text-xs">
                  Please watch the entire video, before proceeding with the form.
                </p>

                <FormField
                  control={form.control}
                  name="video_testimonial"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <VideoUpload
                          label="Video Testimonials"
                          value={field.value}
                          onChange={field.onChange}
                          required={true}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </form>

          <div className="flex p-2 pt-4 gap-2 justify-end border-t">
            <Button
              variant="outline"
              className="rounded bg-transparent cursor-pointer group"
              onClick={handlePrevious}
              disabled={isSubmitting}
            >
              <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-all duration-300" />
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button
                className="rounded bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer group"
                onClick={handleNext}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-all duration-300" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="rounded bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer group"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                ) : (
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-all duration-300" />
                )}
              </Button>
            )}
          </div>
        </div>
      </Form>
    </section>
  )
}

export default BrandingContentPage
