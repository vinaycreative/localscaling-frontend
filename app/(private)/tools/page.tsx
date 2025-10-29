"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

function ToolsPage() {
  const integrations = [
    {
      category: "Website & CMS",
      items: [
        {
          id: 1,
          name: "Webflow",
          icon: "W",
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
          icon: "📊",
          enabled: true,
        },
        {
          id: 3,
          name: "Google Tag Manager",
          icon: "◆",
          enabled: true,
        },
        {
          id: 4,
          name: "Google Search Console",
          icon: "S",
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
          icon: "🎯",
          enabled: true,
        },
      ],
    },
  ];

  return (
    <main className="w-full px-3 pt-4 pb-2 flex flex-col gap-4">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Tools</h1>
        <p className="text-muted-foreground">
          Overview of all connected platforms, their integration status, and
          recent activity across client projects.
        </p>
      </div>

      {/* Integration Categories */}
      <div className="flex flex-col gap-6">
        {integrations.map((section) => (
          <div key={section.category} className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-foreground">
              {section.category}
            </h2>

            {/* Grid of Integration Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.items.map((integration) => (
                <Card
                  key={integration.id}
                  className="bg-card border border-border hover:border-muted-foreground/50 transition-colors"
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                        {integration.icon}
                      </div>
                      <span className="font-medium text-foreground">
                        {integration.name}
                      </span>
                    </div>
                    <Switch checked={integration.enabled} />
                  </CardHeader>

                  <CardContent className="pt-0">
                    <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                      View integration
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default ToolsPage;
