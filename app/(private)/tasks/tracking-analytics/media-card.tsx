"use client";

import Image from "next/image";

export function MediaCard() {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="space-y-0">
        <h1 className="font-semibold text-foreground">4. Tools Access</h1>
        <p className="text-sm text-muted-foreground">
          Enable analytics and performance tracking.
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
  );
}
