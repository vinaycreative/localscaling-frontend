"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  BadgeCheck,
  BarChart3,
  Boxes,
  Check,
  HelpCircle,
  Search,
} from "lucide-react";
import { useState } from "react";

type ToolId = "ads" | "gtm" | "ga4" | "gsc";

export type ToolRowProps = {
  id: ToolId;
  label: string;
  required?: boolean;
  help?: string;
  icon?: "ads" | "gtm" | "ga4" | "gsc";
  className?: string;
};

const iconMap: Record<NonNullable<ToolRowProps["icon"]>, React.ReactNode> = {
  ads: <BadgeCheck className="h-4 w-4 text-primary" aria-hidden="true" />,
  gtm: <Boxes className="h-4 w-4 text-primary" aria-hidden="true" />,
  ga4: <BarChart3 className="h-4 w-4 text-primary" aria-hidden="true" />,
  gsc: <Search className="h-4 w-4 text-primary" aria-hidden="true" />,
};

export function ToolRow({
  id,
  label,
  required = true,
  help,
  icon = "ads",
  className,
}: ToolRowProps) {
  const [granted, setGranted] = useState(false);

  return (
    <div className={cn("flex items-center justify-between  py-2", className)}>
      {granted ? (
        <div className="inline-flex items-center gap-2 rounded-md border bg-secondary px-3 py-1.5 text-sm text-secondary-foreground">
          <Check className="h-4 w-4" aria-hidden="true" />
          Access granted
        </div>
      ) : (
        <Button
          variant="outline"
          className="cursor-pointer bg-transparent"
          onClick={() => setGranted(true)}
        >
          {iconMap[icon]}
          <span className="ml-2">Grant {label.toLowerCase()} access</span>
        </Button>
      )}
    </div>
  );
}
