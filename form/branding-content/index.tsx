"use client"
import BrandAssetUploader from "@/components/reusable/brand-asset-uploader"
import ColorPickerInput from "@/components/reusable/color-picker"
import { CustomInput } from "@/components/reusable/custom-input"
import OnboardingVideo from "@/components/reusable/onboarding-video"
import { VideoUpload } from "@/components/reusable/video-upload"
import { Button } from "@/components/ui/button"
import { uploadFileToStorage } from "@/lib/storage"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Fragment, useEffect, useState } from "react"
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
import FormLayout from "@/components/ui/form-layout"
import { brandingContentSchema } from "./schema"
import { BrandingContentFormValues, BrandingInfoPayload } from "./types"

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

function BrandingContentForm() {
  const router = useRouter()

  const {
    data: brandingInfoData,
    isLoading: brandingInfoLoading,
    error: brandingInfoError,
  } = useBrandingInfo()

  const { createBrandingInfo, isPending, error: createBrandingInfoError } = useCreateBrandingInfo()

  const isEmpty = Object.keys(brandingInfoData || {})?.length === 0
  console.log("🚀 ~ BrandingContentForm ~ brandingInfoData:", brandingInfoData)

  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  const form = useForm<BrandingContentFormValues>({
    resolver: zodResolver(brandingContentSchema),
    defaultValues: {
      font_link: "",
      primary_brand_color: "#007BFF",
      secondary_brand_color: "#6C757D",
      logo_file: null,
      team_photos: null,
      team_members: [{ name: "", position: "" }],
      video_creation_option: "upload",
      ceo_video: null,
      video_testimonial: null,
    },
  })

  const {
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = form

  useEffect(() => {
    const loadData = async () => {
      console.log("🚀 ~ loadData ~ isEmpty:", isEmpty)
      if (!isEmpty) {
        const dbData = brandingInfoData
        let logo_file = null
        if (dbData.logo_url) {
          logo_file = await urlToFile(dbData.logo_url, "logo.png", "image/png")
          console.log("🚀 ~ loadData ~ logo_file:", logo_file)
          setValue("logo_file", logo_file)
        }

        let team_photos: File[] = []
        if (dbData.team_photo_urls && Array.isArray(dbData.team_photo_urls)) {
          team_photos = await Promise.all(
            dbData.team_photo_urls.map((url: string, index: number) =>
              urlToFile(url, `team-${index}.jpg`, "image/jpeg")
            )
          )
          console.log("🚀 ~ loadData ~ team_photos:", team_photos)
          setValue("team_photos", team_photos)
        }

        let ceo_video = null
        if (dbData.ceo_video_url) {
          ceo_video = await urlToFile(dbData.ceo_video_url, "ceo-intro.mp4", "video/mp4")
          console.log("🚀 ~ loadData ~ ceo_video:", ceo_video)
          setValue("ceo_video", ceo_video)
        }

        let videoTestimonial = null
        if (dbData.video_testimonial_url) {
          videoTestimonial = await urlToFile(
            dbData.video_testimonial_url,
            "testimonial.mp4",
            "video/mp4"
          )
          console.log("🚀 ~ loadData ~ videoTestimonial:", videoTestimonial)
          setValue("video_testimonial", videoTestimonial)
        }

        ;(Object.keys(brandingInfoData) as Array<keyof BrandingContentFormValues>)
          .filter(
            (el) =>
              ![
                "id",
                "team_photo_urls",
                "ceo_video_url",
                "video_testimonial_url",
                "logo_url",
              ].includes(el)
          )
          .forEach((key) => {
            const value = brandingInfoData?.[key]

            if (value !== undefined) {
              setValue(key, value)
            }
          })
      }
    }

    if (brandingInfoData) {
      loadData()
    }
  }, [brandingInfoData])

  const onSubmit = async (values: BrandingContentFormValues) => {
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

        // font_link: "https://sacasc.com",
        // primary_brand_color: "#007BFF",
        // secondary_brand_color: "#6C757D",
        // logo_url: "",
        // team_photo_urls: [],
        // team_members: [
        //   {
        //     name: "savkn",
        //     position: "casa",
        //   },
        // ],
        // video_creation_option: "upload",
        // ceo_video_url:
        //   "https://fuzryaranbexqdqycfzl.supabase.co/storage/v1/object/public/videos/ceo-intro/Game-1765872505799.mp4",
        // video_testimonial_url:
        //   "https://fuzryaranbexqdqycfzl.supabase.co/storage/v1/object/public/videos/testimonials/Game-1765872526299.mp4",
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

  const handleNext = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const isValid = await form.trigger()

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

  const handlePrevious = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="overflow-scroll">
          <FormLayout
            footer={
              <Fragment>
                <Button
                  type="button"
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
                    type="button"
                    className="rounded bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer group"
                    onClick={handleNext}
                  >
                    Next {currentStep}
                    <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-all duration-300" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="rounded bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer group"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : isEmpty ? "Update" : "Submit"}
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    ) : (
                      <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-all duration-300" />
                    )}
                  </Button>
                )}
              </Fragment>
            }
          >
            {currentStep === 1 && (
              <Fragment>
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
                          field={field.name}
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
              </Fragment>
            )}

            {currentStep === 2 && (
              <Fragment>
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
                          label="CEO Introductory Video"
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
              </Fragment>
            )}

            {currentStep === 3 && (
              <Fragment>
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
              </Fragment>
            )}
          </FormLayout>
        </form>
      </Form>
    </section>
  )
}

export default BrandingContentForm
