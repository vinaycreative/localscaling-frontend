"use client"
import BrandAssetUploader from "@/components/reusable/brand-asset-uploader"
import ColorPickerInput from "@/components/reusable/color-picker"
import { CustomInput } from "@/components/reusable/custom-input"
import OnboardingVideo from "@/components/reusable/onboarding-video"
import { VideoUpload } from "@/components/reusable/video-upload"
import { Button } from "@/components/ui/button"
import { uploadFileToStorage, urlToFile } from "@/lib/storage"
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Palette,
  Video,
  Users,
  Image as ImageIcon,
  Type,
  Upload,
  X,
  ImageUp,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Fragment, useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { TeamMemberList } from "./components/member-entry-list"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useLoggedInUser } from "@/hooks/useAuth"
import { showFormErrors } from "@/lib/errors"
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload"
import { cn } from "@/lib/utils"

function BrandingContentForm() {
  const router = useRouter()
  const { user } = useLoggedInUser()

  const { data: brandingInfoData, isLoading: brandingInfoLoading } = useBrandingInfo()

  const { createBrandingInfo } = useCreateBrandingInfo()

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
  const logo_file = watch("logo_file")
  const onFileReject = useCallback((file: File, message: string) => {
    toast.error(`Error : ${message}`)
  }, [])

  // Prevent refetches from overwriting user edits after initial hydration.
  const hasHydratedRef = useRef(false)

  useEffect(() => {
    // Only hydrate once per mount (avoid overwriting user changes on background refetches).
    if (hasHydratedRef.current) return

    const empty = Object.keys(brandingInfoData || {}).length === 0
    if (empty) return

    hasHydratedRef.current = true

    let cancelled = false
    const dbData = brandingInfoData

    // 1) Hydrate non-file fields immediately (fast + reliable)
    form.reset(
      {
        font_link: dbData.font_link ?? "",
        primary_brand_color: dbData.primary_brand_color ?? "#007BFF",
        secondary_brand_color: dbData.secondary_brand_color ?? "#6C757D",
        team_members:
          Array.isArray(dbData.team_members) && dbData.team_members.length > 0
            ? dbData.team_members
            : [{ name: "", position: "" }],
        video_creation_option: dbData.video_creation_option ?? "upload",
        // file-backed fields are hydrated async below
        logo_file: null,
        team_photos: null,
        ceo_video: null,
        video_testimonial: null,
      },
      {
        keepDefaultValues: true,
      }
    )

    // 2) Hydrate file fields in parallel (doesn't block the rest of the form)
    ;(async () => {
      const [logoFile, ceoVideo, testimonialVideo, teamPhotosSettled] = await Promise.all([
        dbData.logo_url ? urlToFile(dbData.logo_url) : null,
        dbData.ceo_video_url ? urlToFile(dbData.ceo_video_url) : null,
        dbData.video_testimonial_url ? urlToFile(dbData.video_testimonial_url) : null,
        Array.isArray(dbData.team_photo_urls)
          ? Promise.allSettled(dbData.team_photo_urls.map((url: string) => urlToFile(url)))
          : Promise.resolve([] as PromiseSettledResult<File>[]),
      ])

      if (cancelled) return

      if (logoFile) setValue("logo_file", logoFile, { shouldDirty: false })
      if (ceoVideo) setValue("ceo_video", ceoVideo, { shouldDirty: false })
      if (testimonialVideo) setValue("video_testimonial", testimonialVideo, { shouldDirty: false })

      const teamPhotos =
        teamPhotosSettled.length > 0
          ? teamPhotosSettled
              .filter((r): r is PromiseFulfilledResult<File> => r.status === "fulfilled")
              .map((r) => r.value)
          : []
      setValue("team_photos", teamPhotos, { shouldDirty: false })
    })().catch((e) => {
      // Non-blocking: even if files fail, the rest of the form stays hydrated.
      console.error("Failed to hydrate branding files:", e)
    })

    return () => {
      cancelled = true
    }
  }, [brandingInfoData, form, setValue])

  const onSubmit = async (values: BrandingContentFormValues) => {
    console.log("🚀 ~ onSubmit ~ values:", values)

    try {
      // LOGO -> branding-assets/logos
      const logo_file = values.logo_file || null
      let logoUrl = ""
      if (logo_file) {
        // Optimization: Skip upload if it's the same file content (simple check would be name/size/type match against saved)
        // For now, we upload to ensure consistency.
        logoUrl = await uploadFileToStorage(logo_file, "logo", user?.id ?? "")
      }
      // TEAM PHOTOS -> branding-assets/team
      const team_photos: File[] = values.team_photos || []
      let teamPhotoUrls: string[] = []
      if (team_photos && team_photos.length > 0) {
        const uploadPromises = team_photos.map((f, i) =>
          uploadFileToStorage(f, "team-photo-" + i, user?.id ?? "")
        )
        teamPhotoUrls = await Promise.all(uploadPromises)
      }
      // CEO VIDEO -> videos/ceo-intro
      const ceo_video = values.ceo_video || null
      let ceoVideoUrl = null
      if (ceo_video) {
        ceoVideoUrl = await uploadFileToStorage(ceo_video, "ceo-video", user?.id ?? "")
      }
      // TESTIMONIALS -> videos/testimonials

      const videoTestimonial = values.video_testimonial || null
      let videoTestimonialUrl = null
      if (videoTestimonial) {
        videoTestimonialUrl = await uploadFileToStorage(
          videoTestimonial,
          "testimonial",
          user?.id ?? ""
        )
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
      showFormErrors(errors)
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
            headerClassName="flex-col items-start !justify-start"
            header={
              <div className="w-full py-2">
                <div className="flex items-center justify-between w-full">
                  <div className="mb-2">
                    {/* <h2 className="text-lg font-semibold">Branding & Content</h2> */}
                    <p className="text-sm text-muted-foreground">
                      Step {currentStep} of {totalSteps}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalSteps }).map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index + 1 === currentStep
                            ? "bg-primary w-8"
                            : index + 1 < currentStep
                              ? "bg-primary/60 w-2"
                              : "bg-muted w-2"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <Progress value={(currentStep / totalSteps) * 100} className="h-1.5 w-full" />
              </div>
            }
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
                    Continue to Step {currentStep + 1}
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
              <div className="space-y-6">
                {/* Brand Identity: Typography & Colors */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="w-5 h-5 text-primary" />
                      Brand Identity
                    </CardTitle>
                    <CardDescription>
                      Define your brand&apos;s typography and color palette
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="font_link"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 mb-2">
                            <Type className="w-4 h-4 text-muted-foreground" />
                            Font Link <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <CustomInput
                              label=""
                              id="font_link"
                              type="text"
                              placeholder="https://fonts.google.com/..."
                              required={true}
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <FormLabel className="flex items-center gap-2 text-base">
                        <Palette className="w-4 h-4 text-muted-foreground" />
                        Brand Colors
                      </FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Enter a hex code like #3B82F6 or #fff, or pick from the palette.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Brand Assets: Logo & Team Photos */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-primary" />
                      Brand Assets
                    </CardTitle>
                    <CardDescription>Upload your logo and team photos</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="logo_file"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Logo</FormLabel>
                          <FormControl>
                            {/* <BrandAssetUploader
                              label=""
                              field={field?.name}
                              multiple={false}
                              value={field.value as File}
                              onChange={field.onChange}
                              maxFiles={1}
                            /> */}
                            <FileUpload
                              maxFiles={1}
                              maxSize={5 * 1024 * 1024}
                              className="w-full"
                              value={
                                field.value
                                  ? [...(Array.isArray(field.value) ? field.value : [field.value])]
                                  : []
                              }
                              defaultValue={
                                field.value
                                  ? [...(Array.isArray(field.value) ? field.value : [field.value])]
                                  : []
                              }
                              onValueChange={(val) => {
                                field.onChange(val ?? null)
                              }}
                              accept="image/*"
                              onFileReject={onFileReject}
                              multiple={false}
                            >
                              <FileUploadDropzone>
                                <div className="flex flex-col items-center gap-2 text-center">
                                  <div
                                    className={cn(
                                      "mx-auto h-12 w-12 rounded flex items-center justify-center",
                                      "bg-muted text-muted-foreground"
                                    )}
                                    aria-hidden="true"
                                  >
                                    <ImageUp />
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <p className="text-sm text-muted-foreground">
                                      <span className="text-primary cursor-pointer">
                                        Click to upload
                                      </span>{" "}
                                      or drag and drop
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {" "}
                                      SVG, PNG or JPG
                                    </p>
                                  </div>

                                  <FileUploadTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="mt-2 cursor-pointer rounded-xs bg-transparent font-normal hover:bg-muted/20 transition-all duration-300"
                                    >
                                      Browse files
                                    </Button>
                                  </FileUploadTrigger>
                                </div>
                              </FileUploadDropzone>
                              <FileUploadList className="">
                                {logo_file
                                  ? [...(Array.isArray(logo_file) ? logo_file : [logo_file])].map(
                                      (file: File, index: number): React.ReactNode => (
                                        <FileUploadItem key={index} value={file}>
                                          <FileUploadItemPreview />
                                          <FileUploadItemMetadata />
                                          <FileUploadItemDelete
                                            asChild
                                            className="absolute top-2 right-2"
                                          >
                                            <Button variant="ghost" size="icon" className="size-7">
                                              <X />
                                            </Button>
                                          </FileUploadItemDelete>
                                        </FileUploadItem>
                                      )
                                    )
                                  : null}
                              </FileUploadList>
                            </FileUpload>
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
                          <FormLabel>Team Photos</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">
                                Portrait photos in corporate attire (max 6)
                              </p>
                              <BrandAssetUploader
                                label=""
                                field={field.name}
                                multiple={true}
                                value={field.value}
                                onChange={field.onChange}
                                maxFiles={6}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Team Information: Team Members */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Team Information
                    </CardTitle>
                    <CardDescription>Add your team members and their positions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="team_members"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <TeamMemberList
                              label="Add Team Members"
                              value={field.value}
                              onChange={field.onChange}
                              addButtonLabel="Add Team Member"
                              minRows={1}
                              required={true}
                              errors={errors?.team_members}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-primary" />
                    CEO Introductory Video
                  </CardTitle>
                  <CardDescription>
                    Upload your CEO introduction video or schedule a session to create one
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg border border-dashed border-primary/20 bg-primary/5 p-4">
                    <p className="text-sm text-muted-foreground italic flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Please watch the entire video before proceeding with the form.
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="ceo_video"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEO Introductory Video</FormLabel>
                        <FormControl>
                          <VideoUpload
                            label=""
                            value={field.value}
                            onChange={field.onChange}
                            required={true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {!watch("ceo_video") && (
                    <div className="space-y-4 pt-4 border-t">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">
                          Don&apos;t have an introductory video?
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Choose how you&apos;d like us to help you create one.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="video_creation_option"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Card
                                  className={`cursor-pointer transition-all duration-300 hover:border-primary/50 ${
                                    watch("video_creation_option") === "studio"
                                      ? "ring-2 ring-primary border-primary bg-primary/5"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    field.onChange("studio")
                                  }}
                                >
                                  <CardContent className="p-4">
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                          <Video className="w-4 h-4 text-primary" />
                                        </div>
                                        <h4 className="font-semibold text-sm">Studio Session</h4>
                                      </div>
                                      <p className="text-xs text-muted-foreground">
                                        Book a slot at our studio to record your professional
                                        introduction.
                                      </p>
                                    </div>
                                  </CardContent>
                                </Card>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="video_creation_option"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Card
                                  className={`cursor-pointer transition-all duration-300 hover:border-primary/50 ${
                                    watch("video_creation_option") === "remote"
                                      ? "ring-2 ring-primary border-primary bg-primary/5"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    field.onChange("remote")
                                  }}
                                >
                                  <CardContent className="p-4">
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                          <Video className="w-4 h-4 text-primary" />
                                        </div>
                                        <h4 className="font-semibold text-sm">Record Remotely</h4>
                                      </div>
                                      <p className="text-xs text-muted-foreground">
                                        Schedule an online session. Our team will guide you over a
                                        video call and edit it for you.
                                      </p>
                                    </div>
                                  </CardContent>
                                </Card>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-primary" />
                    Video Testimonials
                  </CardTitle>
                  <CardDescription>
                    Upload customer testimonials to showcase your brand credibility
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg border border-dashed border-primary/20 bg-primary/5 p-4">
                    <p className="text-sm text-muted-foreground italic flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Please watch the entire video before proceeding with the form.
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="video_testimonial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Video Testimonials</FormLabel>
                        <FormControl>
                          <VideoUpload
                            label=""
                            value={field.value}
                            onChange={field.onChange}
                            required={true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}
          </FormLayout>
        </form>
      </Form>
    </section>
  )
}

export default BrandingContentForm
