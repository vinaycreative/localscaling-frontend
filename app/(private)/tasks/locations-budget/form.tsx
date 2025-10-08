"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { TagMultiInput } from "./tag-multi-input";

export function LocationsBudgetForm() {
  const [currency, setCurrency] = useState("EUR");
  const [budget, setBudget] = useState<string>("1000");

  return (
    <Card className="rounded-lg border">
      <div className="space-y-4 p-4 md:p-6">
        {/* Set monthly ads budget */}
        <div className="space-y-2">
          <Label htmlFor="budget" className="text-sm font-medium">
            Set monthly ads budget *<span className="sr-only">required</span>
          </Label>
          <div className="flex items-center gap-2">
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EUR">€ (EUR)</SelectItem>
                <SelectItem value="USD">$ (USD)</SelectItem>
                <SelectItem value="GBP">£ (GBP)</SelectItem>
              </SelectContent>
            </Select>
            <Input
              id="budget"
              inputMode="numeric"
              pattern="[0-9]*"
              value={budget}
              onChange={(e) => setBudget(e.target.value.replace(/[^\d]/g, ""))}
              placeholder="1000"
              className="flex-1"
              aria-describedby="budget-help"
            />
          </div>
        </div>

        {/* Locations */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Most important locations for SEO *
            <span className="sr-only">required</span>
          </Label>
          <TagMultiInput
            id="locations"
            placeholder="Add a location and press Enter"
            defaultValues={[
              "Hamburg",
              "Mainz",
              "Dortmund",
              "Leipzig",
              "Munich",
              "Berlin",
              "Cologne",
              "Augsburg",
              "Essen",
              "Stuttgart",
              "Bonn",
              "Hanover",
            ]}
          />
        </div>

        {/* Services */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Services provided *<span className="sr-only">required</span>
          </Label>
          <TagMultiInput
            id="services"
            placeholder="Add a service and press Enter"
            defaultValues={["Lorem ipsum"]}
          />
        </div>
      </div>

      <Separator />
      <div className="flex items-center justify-end gap-2 p-4 md:p-6">
        <Button variant="outline" className="gap-1 bg-transparent">
          <ChevronLeft className="size-4" />
          Previous
        </Button>
        <Button className="gap-1">
          Submit
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </Card>
  );
}
