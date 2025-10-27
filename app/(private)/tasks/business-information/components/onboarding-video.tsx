import Image from "next/image"
import React from "react"

const OnboardingVideo = () => {
  return (
    <div className="flex flex-col gap-4 w-[360px]">
      <div className="space-y-0">
        <h1 className="font-semibold text-foreground">1. General Business Information</h1>
        <p className="text-xs text-muted-foreground">Provide essential company details.</p>
      </div>

      <div className="relative aspect-video bg-muted rounded w-full mx-auto shadow-xl overflow-hidden">
        <Image
          src="/video.jpg"
          alt="Business consultation video"
          className="w-full h-full object-cover"
          width={1000}
          height={1000}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-primary/80 rounded-full flex items-center justify-center">
            <div className="w-0 h-0 border-l-[12px] border-l-primary-foreground border-y-[8px] border-y-transparent ml-1"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnboardingVideo
