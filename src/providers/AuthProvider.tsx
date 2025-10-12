"use client"

import * as React from "react"
import { Authenticated, Unauthenticated } from "convex/react"
import { SignInButton } from "@clerk/nextjs"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import type { Id } from "@/../convex/_generated/dataModel"

interface AuthProviderProps {
  children?: React.ReactNode
  headerBasePathLabel?: string
  headerPageId?: Id<"landingPages"> | undefined
  headerPageTitle?: string | undefined
  headerOnBack?: (() => void) | undefined
}

export default function AuthProvider({ children, headerBasePathLabel, headerPageId, headerPageTitle, headerOnBack }: AuthProviderProps) {
  return (
    <>
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
              basePathLabel={headerBasePathLabel}
              pageId={headerPageId}
              pageTitle={headerPageTitle}
              onBack={headerOnBack}
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
    </>
  )
}


