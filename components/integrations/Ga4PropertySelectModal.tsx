"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useQueryClient, useQuery } from "@tanstack/react-query"
import { getGoogleAnalytics4Properties } from "@/api/integrations"

interface GA4Property {
  propertyId: string
  displayName: string
  timezone?: string
}

interface Ga4PropertySelectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  integrationId: string
  onVerifyGa4Connect?: (payload: {
    integrationId: string
    propertyId: string
    propertyName: string
  }) => Promise<void>
  onSuccess?: () => void
}

export function Ga4PropertySelectModal({
  open,
  onOpenChange,
  integrationId,
  onVerifyGa4Connect,
  onSuccess,
}: Ga4PropertySelectModalProps) {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()

  // Only fetch properties when modal is open
  const { data: properties = [], isLoading: isLoadingProperties } = useQuery({
    queryKey: ["google-analytics-4-properties", integrationId],
    queryFn: () => getGoogleAnalytics4Properties(integrationId),
    enabled: open && !!integrationId && integrationId !== "undefined",
  })

  const handleConfirm = async () => {
    if (!selectedPropertyId) {
      return
    }

    // Find the selected property to get its name
    const selectedProperty = properties.find(
      (p: GA4Property) => p.propertyId === selectedPropertyId
    )
    if (!selectedProperty) {
      toast.error("Selected property not found")
      return
    }

    setIsSubmitting(true)
    try {
      // Verify the GA4 connection with the selected property
      if (onVerifyGa4Connect) {
        await onVerifyGa4Connect({
          integrationId,
          propertyId: selectedPropertyId,
          propertyName: selectedProperty.displayName,
        })
      }

      // Invalidate queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["integrations"] })
      queryClient.invalidateQueries({ queryKey: ["google-analytics-4-properties"] })
      onOpenChange(false)
      setSelectedPropertyId("")
      onSuccess?.()
    } catch (error) {
      console.error("Failed to verify GA4 connection:", error)
      toast.error("Failed to verify GA4 connection. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset selection when closing
      setSelectedPropertyId("")
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Select a Google Analytics property</DialogTitle>
          <DialogDescription className="text-left">
            Choose the website you want to track in LocalScaling. You can change this later.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isLoadingProperties ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No properties available</p>
            </div>
          ) : (
            <RadioGroup value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
              <div className="space-y-3">
                {properties.map((property: GA4Property) => (
                  <div
                    key={property.propertyId}
                    className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-accent/50 transition-colors"
                  >
                    <RadioGroupItem
                      value={property.propertyId}
                      id={property.propertyId}
                      className="mt-0.5"
                    />
                    <Label
                      htmlFor={property.propertyId}
                      className="flex-1 cursor-pointer space-y-1 font-normal"
                    >
                      <div className="font-medium text-sm">{property.displayName}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>ID: {property.propertyId}</span>
                        {property.timezone && (
                          <>
                            <span>•</span>
                            <span>{property.timezone}</span>
                          </>
                        )}
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedPropertyId || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Confirming...
              </>
            ) : (
              "Confirm Selection"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
