"use client";

import Page from "@/components/base/Page";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { useState } from "react";

function ToolsPage() {
  const [integrations, setIntegrations] = useState([
    {
      category: "Website & CMS",
      items: [
        {
          id: 1,
          name: "Webflow",
          icon: "/webflow.png",
          enabled: true,
        },
      ],
    },
    {
      category: "Analytics & Tracking",
      items: [
        {
          id: 2,
          name: "Google Analytics 4",
          icon: "/google-analytics.png",
          enabled: true,
        },
        {
          id: 3,
          name: "Google Tag Manager",
          icon: "/google-tag.png",
          enabled: true,
        },
        {
          id: 4,
          name: "Google Search Console",
          icon: "/google-search.png",
          enabled: true,
        },
      ],
    },
    {
      category: "Advertising",
      items: [
        {
          id: 5,
          name: "Google Ads",
          icon: "/google-ads.png",
          enabled: true,
        },
      ],
    },
    {
      category: "CRM & Communication",
      items: [
        {
          id: 6,
          name: "Pipedrive",
          icon: "/pipedrive.png",
          enabled: true,
        },
      ],
    },
    {
      category: "Scheduling",
      items: [
        {
          id: 7,
          name: "Cal.com",
          icon: "/cal.png",
          enabled: true,
        },
      ],
    },
    {
      category: "File Management",
      items: [
        {
          id: 8,
          name: "Google Drive",
          icon: "/google-drive.png",
          enabled: true,
        },
      ],
    },
  ]);

  const handleToggle = (categoryIndex: number, itemIndex: number) => {
    const newIntegrations = [...integrations];
    newIntegrations[categoryIndex].items[itemIndex].enabled =
      !newIntegrations[categoryIndex].items[itemIndex].enabled;
    setIntegrations(newIntegrations);
  };

  return (
    <Page
      navURL="Dashboard"
      title="Tools"
      description="Overview of all connected platforms, their integration status, and
          recent activity across client projects."
    >
      <div className="flex flex-col gap-6 py-4 flex-1 overflow-y-auto">
        {integrations.map((section, categoryIndex) => (
          <div key={section.category} className="flex flex-col gap-3">
            <h2 className="text-lg font-medium text-foreground">
              {section.category}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.items.map((integration, itemIndex) => (
                <Card
                  key={integration.id}
                  className="bg-card border transition-all duration-300 rounded-md p-0"
                >
                  <CardHeader className="flex flex-row items-start justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded flex items-center justify-center bg-muted">
                        <Image
                          src={integration.icon || "/placeholder.svg"}
                          alt={integration.name}
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      </div>
                      <span className="font-medium text-foreground">
                        {integration.name}
                      </span>
                    </div>
                    <div className="px-2 py-1">
                      <Switch
                        checked={integration.enabled}
                        onCheckedChange={() =>
                          handleToggle(categoryIndex, itemIndex)
                        }
                        className="cursor-pointer"
                      />
                    </div>
                  </CardHeader>

                  <CardContent className="px-4 py-2 border-t flex items-center justify-end">
                    <button className="text-sm cursor-pointer font-medium text-primary hover:text-primary/80 transition-colors">
                      View integration
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
}

export default ToolsPage;
