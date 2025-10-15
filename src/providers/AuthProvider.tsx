"use client"

import * as React from "react"
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react"
import { SignInButton } from "@clerk/nextjs"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import type { Id } from "@/../convex/_generated/dataModel"
import { usePathname } from "next/navigation"

interface HeaderState {
  basePathLabel?: string
  pageId?: Id<"landingPages"> | undefined
  pageTitle?: string | undefined
  onBack?: (() => void) | undefined
}

type HeaderContextValue = {
  header: HeaderState
  updateHeader: (partial: Partial<HeaderState>) => void
  resetHeader: () => void
}

const HeaderContext = React.createContext<HeaderContextValue | null>(null)

export function useHeader(): HeaderContextValue {
  const ctx = React.useContext(HeaderContext)
  if (!ctx) {
    throw new Error("useHeader must be used within AuthProvider")
  }
  return ctx
}

interface AuthProviderProps {
  children?: React.ReactNode
  headerBasePathLabel?: string
  headerPageId?: Id<"landingPages"> | undefined
  headerPageTitle?: string | undefined
  headerOnBack?: (() => void) | undefined
}

export default function AuthProvider({ children, headerBasePathLabel = "Dashboard", headerPageId, headerPageTitle, headerOnBack }: AuthProviderProps) {
  const pathname = usePathname()
  // Public slug pages: exactly one non-reserved top-level segment
  const pn = pathname ?? "/"
  const qIdx = pn.indexOf("?")
  const pathNoQuery = qIdx === -1 ? pn : pn.slice(0, qIdx)
  const pathSegments = pathNoQuery.split('/').filter(Boolean)
  const reservedTopLevel = new Set(["pages", "assets", "leads", "statistiken", "api", "trpc", "revalidate"])
  const isPublicSlug = pathSegments.length === 1 && !reservedTopLevel.has(pathSegments[0] ?? "")

  if (isPublicSlug) {
    // Bypass sidebar/header and auth wrappers on public slug routes
    return <>{children}</>
  }
  const initPath = (pathname ?? "/")
  let initBaseLabel = headerBasePathLabel
  if (initPath.startsWith("/pages")) initBaseLabel = "Landingpages"
  else if (initPath.startsWith("/assets")) initBaseLabel = "Assets"
  else if (initPath.startsWith("/leads")) initBaseLabel = "Leads"
  else if (initPath.startsWith("/statistiken")) initBaseLabel = "Statistiken"

  const [header, setHeader] = React.useState<HeaderState>({
    basePathLabel: initBaseLabel,
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

  const headerContextValue: HeaderContextValue = React.useMemo(
    () => ({ header, updateHeader, resetHeader }),
    [header, updateHeader, resetHeader]
  )

  React.useEffect(() => {
    const currentPath = ((pathname ?? "/").split("?")[0]) ?? "/"
    let baseLabel = "Dashboard"
    if (currentPath.startsWith("/pages")) baseLabel = "Landingpages"
    else if (currentPath.startsWith("/assets")) baseLabel = "Assets"
    else if (currentPath.startsWith("/leads")) baseLabel = "Leads"
    else if (currentPath.startsWith("/statistiken")) baseLabel = "Statistiken"

    setHeader((prev) => ({
      ...prev,
      basePathLabel: baseLabel,
      ...(currentPath.startsWith("/pages")
        ? {}
        : { pageId: undefined, pageTitle: undefined, onBack: undefined }),
    }))
  }, [pathname])

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
              basePathLabel={header.basePathLabel}
              pageId={header.pageId}
              pageTitle={header.pageTitle}
              onBack={header.onBack}
            />
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-6 p-4 md:p-6 h-full">{children}</div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </Authenticated>
      <Unauthenticated>
        <div className="flex min-h-svh items-center justify-center p-6">
          <SignInButton />
        </div>
      </Unauthenticated>
      <AuthLoading>
        <p>Still loading</p>
      </AuthLoading>
    </HeaderContext.Provider>
  )
}


