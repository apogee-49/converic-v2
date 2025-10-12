"use client"

import * as React from "react"
import type { Id } from "@/../convex/_generated/dataModel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/animate-ui/tabs"
import PageEditor from "@/core/editor/pageEditor"
import PageFunnel from "@/core/editor/pageFunnel"
import PageSettings from "@/core/editor/pageSettings"
import PageStyling from "@/core/editor/pageStyling"
import { useQuery } from "convex/react"
import { api } from "@/../convex/_generated/api"
import { SquareMousePointerIcon, FilterIcon, BlocksIcon, SwatchBookIcon, SettingsIcon, EyeIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface EditorProps {
  pageId: Id<"landingPages">
}

export default function Editor({ pageId }: EditorProps) {
  const [activeTab, setActiveTab] = React.useState("editor")
  const page = useQuery(api.landingPages.getPage, { landingPageId: pageId })

  const previewDomain = page?.customDomain ?? (page?.slug ? `${page.slug}.converic.page` : null)
  const previewHref = previewDomain ? `https://${previewDomain}` : "#"
  const previewUrl: string | null = previewDomain ? previewHref : null
  const handlePreviewClick = React.useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!previewUrl) {
      e.preventDefault()
    }
  }, [previewUrl])


  interface TabConfigItem {
    value: string
    label: string
    icon: React.ComponentType<{ className?: string }>
    component?: React.ComponentType<{ pageId: Id<"landingPages"> }>
    isLink?: boolean
  }

  const tabConfig: TabConfigItem[] = [
    { value: "editor", label: "Editor", icon: SquareMousePointerIcon, component: PageEditor },
    { value: "funnel", label: "Funnel", icon: FilterIcon, component: PageFunnel },
    { value: "styling", label: "Webprofil", icon: SwatchBookIcon, component: PageStyling },
    { value: "integrations", label: "Integrationen", icon: BlocksIcon, component: PageFunnel },
    { value: "settings", label: "Einstellungen", icon: SettingsIcon, component: PageSettings },
    { value: "preview", label: "Ansehen", icon: EyeIcon, isLink: true },
  ]

  return (
    <div className="h-full flex flex-col space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 gap-3 flex flex-col">
        <TabsList className="rounded-lg">
          {tabConfig.map((tab) => (
            tab.isLink ? (
              <a
                key={tab.value}
                href={previewUrl ?? '#'}
                onClick={handlePreviewClick}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  'inline-flex items-center justify-center whitespace-nowrap flex gap-2 rounded-md px-3.5 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ' +
                  (previewUrl ? 'hover:text-foreground cursor-pointer' : 'opacity-50 pointer-events-none')
                }
                aria-disabled={!previewUrl}
                tabIndex={previewUrl ? 0 : -1}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </a>
            ) : (
              <TabsTrigger className="hover:text-foreground" key={tab.value} value={tab.value}>
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            )
          ))}
        </TabsList>

        <Separator className="mb-2 -mt-3.5" />
        
        {tabConfig.filter((t) => !t.isLink && t.component).map((t) => (
          t.component ? (
            <TabsContent key={t.value} value={t.value}>
              <t.component pageId={pageId} />
            </TabsContent>
          ) : null
        ))}
      </Tabs> 
    </div>
  )
}
