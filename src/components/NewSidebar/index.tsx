"use client"

import * as React from "react"
import {
  BriefcaseBusiness,
  LayoutDashboard,
  MessageSquare,
  Plus,
  ShoppingCart,
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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { UserInfoAPIContext, UserInfoProvider } from "@/context/UserInfoContext"
import { NavModule } from "../nav-module"
import { DefaultLayoutContext, DefaultLayoutProvider } from "@/context/DefaultLayoutContext"
import { usePathname, useRouter } from "next/navigation"
import { FeedbackDialog } from "../CrmUi/feedback-dialog"
import api from "@/utils/api"


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
  const { role, product, sub_role }  = dataUser;
  const { modalOpen, setModalOpen } = React.useContext(DefaultLayoutContext);



  const data = {
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
            when: product === "global",
          },
          {
            title: "Broker",
            url: "/dashboard/broker",
            when: product === "crm" || product === "global",
          },
          {
            title: "Jurídico",
            url: "/dashboard/juridico",
            when: product === "global" || sub_role === "juridico",
          },
          {
            title: "Wallet",
            url: "/dashboard/wallet",
            when: product === "wallet" || product === "global",
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
            when: product === "global",
          },
          {
            title: "Espaço Gerencial",
            url: "/comercial/espaco",
            when: product === "global",
          },
        ],
      },
  
    ],
    
    projects: [
      {
        name: "PrecaShop",
        url: "/dashboard/marketplace",
        icon: ShoppingCart,
        when: product === "wallet" || product === "global",
      },
    ],

    modules : [
      {
        name: "Novo Precatório",
        logo: Plus,
        fn: () => setModalOpen(!modalOpen),
      },
  ]
  }

  const onFeedbackSubmit = async (data: { reaction: string | null; feedback: string }) => {
    try {
      await api.post("api/feedback/", data)
    } catch (error) {
      console.error("Erro ao enviar o feedback:", error)
    }
}

  return (
    <DefaultLayoutProvider>
    <UserInfoProvider>
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavModule items={data.modules} />
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
        <FeedbackDialog trigger={
          <SidebarMenuButton tooltip="Feedback">
          <MessageSquare className="h-4 w-4" />
          <span>Feedback</span>
        </SidebarMenuButton>
        } onSubmit={onFeedbackSubmit} />
        </SidebarMenuItem>
        </SidebarMenu>
        <NavUser user={dataUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
    </UserInfoProvider>
    </DefaultLayoutProvider>
  )
}
