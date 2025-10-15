"use client"

import * as React from "react"
import { Authenticated } from "convex/react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import type { Id } from "@/../convex/_generated/dataModel"
import { useSelectedLayoutSegment } from "next/navigation"

interface HeaderState {
  basePathLabel?: string
  pageId?: Id<"landingPages"> | undefined
  pageTitle?: string | undefined
  onBack?: (() => void) | undefined
}

interface HeaderContextValue {
  header: HeaderState
  updateHeader: (partial: Partial<HeaderState>) => void
  resetHeader: () => void
}

const HeaderContext = React.createContext<HeaderContextValue | null>(null)

export function useHeader(): HeaderContextValue {
  const ctx = React.useContext(HeaderContext)
  if (!ctx) throw new Error("useHeader must be used within AuthProvider")
  return ctx
}

interface AuthProviderProps {
  children?: React.ReactNode
  headerBasePathLabel?: string
  headerPageId?: Id<"landingPages"> | undefined
  headerPageTitle?: string | undefined
  headerOnBack?: (() => void) | undefined
}

export default function AuthProvider({
  children,
  headerBasePathLabel = "Dashboard",
  headerPageId,
  headerPageTitle,
  headerOnBack
}: AuthProviderProps) {
  const segment = useSelectedLayoutSegment()

  const LABEL_FOR_SEGMENT: Record<string, string> = {
    pages: "Landingpages",
    assets: "Assets",
    leads: "Leads",
    statistiken: "Statistiken",
  }

  const [header, setHeader] = React.useState<HeaderState>({
    basePathLabel: undefined,
    pageId: headerPageId,
    pageTitle: headerPageTitle,
    onBack: headerOnBack,
  })

  const updateHeader = React.useCallback((partial: Partial<HeaderState>) => {
    setHeader((prev) => ({ ...prev, ...partial }))
  }, [])

  const resetHeader = React.useCallback(() => {
    setHeader({ basePathLabel: undefined, pageId: undefined, pageTitle: undefined, onBack: undefined })
  }, [])

  const derivedBaseLabel = segment ? (LABEL_FOR_SEGMENT[segment] ?? headerBasePathLabel) : headerBasePathLabel

  const headerValue: HeaderState = React.useMemo(
    () => ({
      ...header,
      basePathLabel: header.basePathLabel ?? derivedBaseLabel,
      ...(segment === "pages" ? {} : { pageId: undefined, pageTitle: undefined, onBack: undefined }),
    }),
    [header, derivedBaseLabel, segment]
  )

  const headerContextValue: HeaderContextValue = React.useMemo(
    () => ({ header: headerValue, updateHeader, resetHeader }),
    [headerValue, updateHeader, resetHeader]
  )

  return (
    <HeaderContext.Provider value={headerContextValue}>
      <Authenticated>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="inset"/>
          <SidebarInset>
            <SiteHeader
              basePathLabel={headerValue.basePathLabel}
              pageId={headerValue.pageId}
              pageTitle={headerValue.pageTitle}
              onBack={headerValue.onBack}
            />
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-6 p-4 md:p-6 h-full">{children}</div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </Authenticated>
    </HeaderContext.Provider>
  )
}