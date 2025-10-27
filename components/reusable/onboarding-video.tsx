"use client";

import Image from "next/image";
import React from "react";

interface OnboardingVideoProps {
  title: string;
  subTitle: string;
}

const OnboardingVideo = ({ title, subTitle }: OnboardingVideoProps) => {
  return (
    <div className="flex flex-col gap-4 lg:w-[360px] w-full">
      <div className="flex flex-col gap-4 opacity-100">
        <div className="space-y-0">
          <h1 className="font-semibold text-foreground">{title}</h1>
          <p className="text-xs text-muted-foreground">{subTitle}</p>
        </div>
        <div className="relative aspect-video bg-muted rounded lg:w-full w-[360px] mx-auto shadow-xl overflow-hidden">
          <Image
            src="/video.jpg"
            alt={` consultation video`}
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
    </div>
  );
};

export default OnboardingVideo;
