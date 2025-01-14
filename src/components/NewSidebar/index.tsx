"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  Command,
  Frame,
  LayoutDashboard,
  Map,
  PieChart,
  Plus,
  Settings2,
  ShoppingCart,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { UserInfoAPIContext, UserInfoProvider } from "@/context/UserInfoContext"
import { NavModule } from "../nav-module"
import { DefaultLayoutContext, DefaultLayoutProvider } from "@/context/DefaultLayoutContext"
import { usePathname, useRouter } from "next/navigation"


const AtivosLogo = () => {
  return (
    <Image src="/images/logo/ativos_logo_at_default.png" width={90} height={90} alt="Ativos" />
  )
}

const usePath = () => {
  const pathname = usePathname();
  return pathname;
}


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const { data: dataUser } = React.useContext(UserInfoAPIContext)
  const { modalOpen, setModalOpen } = React.useContext(DefaultLayoutContext);

  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "Ativos",
        logo: AtivosLogo as React.ElementType,
        plan: "CelerApp",
      },
    ],
    navMain: [
      {
        title: "Dashboard",
        url: "#",
        icon: LayoutDashboard,
        isActive: window.location.pathname.includes("/dashboard") || window.location.pathname === "/",
        items: [
          {
            title: "Calculadora",
            url: "/",
          },
          {
            title: "Broker",
            url: "/dashboard/broker",
          },
          {
            title: "Jurídico",
            url: "/dashboard/juridico",
          },
          {
            title: "Wallet",
            url: "/dashboard/wallet",
          },
        ],
      },
      {
        title: "Comercial",
        url: "#",
        icon: BriefcaseBusiness,
        isActive: usePath().includes("/comercial"),
        items: [
          {
            title: "Resumo",
            url: "/comercial/resumo",
          },
        ],
      },
  
    ],
    
    projects: [
      {
        name: "PrecaShop",
        url: "/dashboard/marketplace",
        icon: ShoppingCart,
      },
    ],
  }

  return (
    <DefaultLayoutProvider>
    <UserInfoProvider>
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavModule items={[{
      name: "Novo Precatório",
      logo: Plus,
      fn: () => setModalOpen(!modalOpen),
    }]} />
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={dataUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
    </UserInfoProvider>
    </DefaultLayoutProvider>
  )
}
