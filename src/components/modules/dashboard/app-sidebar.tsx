"use client"

import * as React from "react"
import {
  LayoutDashboard,
  FolderKanban,
  ClipboardList,
  Users,
  BarChart3,
  Settings,
  Clock3,
  User,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import { useAppSelector } from "@/store/hooks"
import type { NavItem } from "@/types/navigation.types"

export function AppSidebar(
  props: React.ComponentProps<typeof Sidebar>
) {
  const { user, isAuthenticated } = useAppSelector(
    (state) => state.auth
  )

  /* ----------------------------------------
     Loading Sidebar
  ----------------------------------------- */
  if (!isAuthenticated || !user) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <div className="h-10 rounded-md bg-muted animate-pulse" />
        </SidebarHeader>

        <SidebarContent>
          <div className="space-y-4 p-4">
            <div className="h-8 rounded bg-muted animate-pulse" />
            <div className="h-8 rounded bg-muted animate-pulse" />
            <div className="h-8 rounded bg-muted animate-pulse" />
          </div>
        </SidebarContent>

        <SidebarRail />
      </Sidebar>
    )
  }

  /* ----------------------------------------
     Workspace / Team Data
  ----------------------------------------- */
  const data = React.useMemo(
    () => ({
      user: {
        name: user.name,
        email: user.email,
        avatar: user.avatarUrl || "",
      },

      teams: [
        {
          name: "TaskOrbit",
          logo: () => (
  <img 
    src="/eSoyq.jpg" 
    alt="TaskOrbit" 
    className="h-6 w-6 rounded" 
  />),
          plan: "Project Management System",
        },
      ],
    }),
    [user]
  )

  /* ----------------------------------------
     Admin / Manager Navigation
  ----------------------------------------- */
  const adminNav: NavItem[] = [
    {
      title: "Dashboard",
      url: "/dashboard/admin",
      icon: LayoutDashboard,
    },

    {
      title: "Projects",
      url: "/dashboard/admin/projects",
      icon: FolderKanban,
    },

    {
      title: "Tasks",
      url: "/dashboard/admin/tasks",
      icon: ClipboardList,
    },

    {
      title: "Users",
      url: "/dashboard/admin/users",
      icon: Users,
    },

    {
      title: "Reports",
      url: "/dashboard/admin/reports",
      icon: BarChart3,
    },

    
  ]

  /* ----------------------------------------
     Member Navigation
  ----------------------------------------- */
  const memberNav: NavItem[] = [
    {
      title: "Dashboard",
      url: "/dashboard/member",
      icon: LayoutDashboard,
    },

    {
      title: "My Tasks",
      url: "/dashboard/member/my-tasks",
      icon: ClipboardList,
    },

    {
      title: "Projects",
      url: "/dashboard/member/projects",
      icon: FolderKanban,
    },

    {
      title: "Time Logs",
      url: "/dashboard/member/time-logs",
      icon: Clock3,
    },

   
  ]

  /* ----------------------------------------
     Role-Based Navigation
  ----------------------------------------- */
  const navMain = React.useMemo(() => {
    if (user.role === "member") {
      return memberNav
    }

    return adminNav
  }, [user.role])

  /* ----------------------------------------
     Render
  ----------------------------------------- */
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}