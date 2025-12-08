"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Label } from "@/components/ui/label" // Assuming Label is a custom component

const FormSchema = z.object({
  brandName: z.string(),
  slogan: z.string(),
  mission: z.string(),
  vision: z.string(),
  values: z.string(),
  logo: z.string(),
  primaryColor: z.string(),
  secondaryColor: z.string(),
  font: z.string(),
})

export function BrandingContentForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      brandName: "",
      slogan: "",
      mission: "",
      vision: "",
      values: "",
      logo: "",
      primaryColor: "",
      secondaryColor: "",
      font: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      console.log(data)
      toast.success(`You submitted the following values: ${JSON.stringify(data, null, 2)}`)
    } catch (error) {
      toast.error("Error Something went wrong")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="brandName">Brand Name</Label>
        <Input id="brandName" placeholder="Enter your brand name" {...register("brandName")} />
        {errors.brandName && <p className="text-red-500 text-sm">{errors.brandName.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="slogan">Slogan</Label>
        <Input id="slogan" placeholder="Enter your slogan" {...register("slogan")} />
        {errors.slogan && <p className="text-red-500 text-sm">{errors.slogan.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mission">Mission</Label>
        <Input id="mission" placeholder="Enter your mission" {...register("mission")} />
        {errors.mission && <p className="text-red-500 text-sm">{errors.mission.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="vision">Vision</Label>
        <Input id="vision" placeholder="Enter your vision" {...register("vision")} />
        {errors.vision && <p className="text-red-500 text-sm">{errors.vision.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="values">Values</Label>
        <Input id="values" placeholder="Enter your values" {...register("values")} />
        {errors.values && <p className="text-red-500 text-sm">{errors.values.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="logo">Logo</Label>
        <Input id="logo" type="file" {...register("logo")} />
        {errors.logo && <p className="text-red-500 text-sm">{errors.logo.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="primaryColor">Primary Color</Label>
        <Input id="primaryColor" type="color" {...register("primaryColor")} />
        {errors.primaryColor && (
          <p className="text-red-500 text-sm">{errors.primaryColor.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="secondaryColor">Secondary Color</Label>
        <Input id="secondaryColor" type="color" {...register("secondaryColor")} />
        {errors.secondaryColor && (
          <p className="text-red-500 text-sm">{errors.secondaryColor.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="font">Font</Label>
        <Input id="font" placeholder="Enter your font" {...register("font")} />
        {errors.font && <p className="text-red-500 text-sm">{errors.font.message}</p>}
      </div>

      <Button type="submit">Submit</Button>
    </form>
  )
}
