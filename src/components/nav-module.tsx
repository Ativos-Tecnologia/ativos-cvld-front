"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { FaN } from "react-icons/fa6"

export function NavModule({
  items,
}: {
  items: {
    name: string
    logo?: LucideIcon
    fn?: VoidFunction
    }[]
}) {
  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel>Plataforma</SidebarGroupLabel> */}
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.name}
            asChild
            className="group/collapsible"
          >
            <SidebarMenuItem>
                <SidebarMenuButton className={`border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200 items-center w-full py-3 text-sm font-medium rounded-lg transition-colors duration-200`} onClick={item.fn}>
                  
                  {item.logo && <item.logo />}
                  <span>{item.name}</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
