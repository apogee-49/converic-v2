"use client"

import * as React from "react"
import type { Id } from "@/../convex/_generated/dataModel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PageEditor from "@/core/editor/pageEditor"
import PageFunnel from "@/core/editor/pageFunnel"
import PageSettings from "@/core/editor/pageSettings"
import PageStyling from "@/core/editor/pageStyling"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useQuery } from "convex/react"
import { api } from "@/../convex/_generated/api"

interface EditorProps {
  pageId: Id<"landingPages">
  onBack: () => void
}

export default function Editor({ pageId, onBack }: EditorProps) {
  const [activeTab, setActiveTab] = React.useState("editor")
  const page = useQuery(api.landingPages.getPage, { landingPageId: pageId })

  const renderTabsContent = (value: string, Component: React.ComponentType<{ pageId: Id<"landingPages"> }>) => (
    <TabsContent value={value}>
      <Component pageId={pageId} />
    </TabsContent>
  )

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="shrink-0 flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>Zurück</Button>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
        <TabsList>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="funnel">Funnel</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="styling">Styling</TabsTrigger>
          <Link
            href={`/${page?.slug ?? ""}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            Seite öffnen
          </Link>
        </TabsList>
        {renderTabsContent("editor", PageEditor)}
        {renderTabsContent("funnel", PageFunnel)}
        {renderTabsContent("settings", PageSettings)}
        {renderTabsContent("styling", PageStyling)}
      </Tabs> 
    </div>
  )
}
