"use client"

import * as React from "react"
import {
  IconChartBar,
  IconFile,
  IconHome,
  IconPhoto,
  IconUsers,
  IconFileText,
  IconLifebuoy,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: IconHome,
    },
    {
      title: "Landingpages",
      url: "/pages",
      icon: IconFile,
    },
    {
      title: "Assets",
      url: "/assets",
      icon: IconPhoto,
    },
    {
      title: "Leads",
      url: "/leads",
      icon: IconUsers,
    },
    {
      title: "Statistiken",
      url: "/statistiken",
      icon: IconChartBar,
    },
  ],
  navSecondary: [
    {
      title: "Dokumentation",
      url: "#",
      icon: IconFileText,
    },
    {
      title: "Support",
      url: "#",
      icon: IconLifebuoy,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <span className="text-base font-semibold">FormThing</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
