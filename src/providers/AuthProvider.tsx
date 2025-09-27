"use client"

import * as React from "react"
import { Authenticated, Unauthenticated } from "convex/react"
import { SignInButton } from "@clerk/nextjs"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

interface AuthProviderProps {
  children?: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
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
            <SiteHeader />
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


