"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  HomeIcon,
  GalleryVerticalEnd,
  UsersIcon,
  FolderOpen,
  ChartColumnIcon,
} from "lucide-react"

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
    { title: "Home", url: "/", icon: HomeIcon },
    { title: "Landingpages", url: "/pages", icon: GalleryVerticalEnd },
    { title: "Assets", url: "/assets", icon: FolderOpen },
    { title: "Leads", url: "/leads", icon: UsersIcon },
    { title: "Statistiken", url: "/statistiken", icon: ChartColumnIcon },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu className="flex flex-row gap-2.5 items-center">
          <SidebarMenuItem>
            <Link href="/" className="flex flex-row gap-2.5 items-center">
              <Image priority className="w-11" src="/converic.svg" alt="Converic Logo" width={200} height={50} />
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="mt-6 px-2 flex flex-col gap-1">
        <div className="px-2 mb-0.5">
          <p className="text-[0.75rem] text-foreground/70 font-semibold">Landingpages</p>
        </div>
        {data.navMain.slice(0, 3).map((item) => (
          <SidebarMenuItem key={item.title} className="list-none">
            <SidebarMenuButton asChild className="hover:bg-background hover:text-muted-foreground transition-all duration-100">
              <Link href={item.url}>
                <item.icon className="size-4" />
                {item.title}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        <div className="px-2 mt-5 mb-0.5">
          <p className="text-[0.75rem] text-foreground/70 font-semibold">Leadverwaltung</p>
        </div>
        {data.navMain.slice(3).map((item) => (
          <SidebarMenuItem key={item.title} className="list-none">
            <SidebarMenuButton asChild className="hover:bg-background hover:text-muted-foreground transition-all duration-100">
              <Link href={item.url}>
                <item.icon className="size-4" />
                {item.title}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
