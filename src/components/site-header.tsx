"use client"

import * as React from "react"
import type { Id } from "@/../convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { api } from "@/../convex/_generated/api"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface SiteHeaderProps {
  pageTitle?: string
  basePathLabel?: string
  onBack?: () => void
  pageId?: Id<"landingPages">
}

export function SiteHeader({ pageTitle, basePathLabel = "Landingpages", onBack, pageId }: SiteHeaderProps) {
  const page = useQuery(api.landingPages.getPage, pageId ? { landingPageId: pageId } : "skip")
  const title = pageId ? (page?.title ?? pageTitle ?? "") : (pageTitle ?? "")

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear -mb-6">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 -mr-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              {onBack ? (
                <BreadcrumbLink onClick={onBack} className="cursor-pointer">
                  {basePathLabel}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage >{basePathLabel}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {title && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}
