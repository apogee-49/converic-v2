"use client"

import { UserButton } from "@clerk/nextjs"
import {
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavUser() {
  return (
    <SidebarMenu>
      <SidebarMenuItem className="px-2">
        <UserButton  />
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
