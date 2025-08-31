/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import { useState } from "react";
// import { FileText, Building2, Users, BarChart3, Home } from "lucide-react";
// import { NavLink, useLocation } from "react-router-dom";
// import { useAuthContext } from "../contexts/AuthContext";

// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarTrigger,
//   useSidebar,
// } from "../components/ui/sidebar";

// const baseItems = [
//   { title: "Dashboard", url: "/", icon: Home },
//   { title: "Documents", url: "/documents", icon: FileText },
//   { title: "Analytics", url: "/analytics", icon: BarChart3 },
// ];

// const adminItems = [
//   { title: "Organizations", url: "/organizations", icon: Building2 },
//   { title: "Users", url: "/users", icon: Users },
// ];

// export function AppSidebar() {
//   const { state } = useSidebar();
//   const location = useLocation();
//   const { user } = useAuthContext();
//   const currentPath = location.pathname;

//   const isActive = (path: string) => currentPath === path;

//   const getNavCls = ({ isActive }: { isActive: boolean }) =>
//     isActive
//       ? "bg-accent text-accent-foreground font-medium"
//       : "hover:bg-accent/50";

//   const allItems =
//     user?.role === "admin" ? [...baseItems, ...adminItems] : baseItems;

//   return (
//     <Sidebar collapsible="icon">
//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarGroupLabel>ContractHub</SidebarGroupLabel>

//           <SidebarGroupContent>
//             <SidebarMenu>
//               {allItems.map((item) => (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton asChild>
//                     <NavLink to={item.url} end className={getNavCls}>
//                       <item.icon className="mr-2 h-4 w-4" />
//                       {state !== "collapsed" && <span>{item.title}</span>}
//                     </NavLink>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//     </Sidebar>
//   );
// }

// import { useState } from "react";
// import { FileText, Building2, Users, BarChart3, Home } from "lucide-react";
// import { NavLink, useLocation } from "react-router-dom";
// import { useAuthContext } from "../contexts/AuthContext";
// import { useQuery } from "@tanstack/react-query";
// import { userService } from "../services/user.service";
// import { organizationService } from "../services/organization.service";
// import { documentService } from "../services/document.service";

// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarTrigger,
//   useSidebar,
// } from "../components/ui/sidebar";

// const baseItems = [
//   { title: "Dashboard", url: "/", icon: Home },
//   { title: "Documents", url: "/documents", icon: FileText },
//   { title: "Analytics", url: "/analytics", icon: BarChart3 },
// ];

// const adminItems = [
//   { title: "Organizations", url: "/organizations", icon: Building2 },
//   { title: "Users", url: "/users", icon: Users },
// ];

// export function AppSidebar() {
//   const { state } = useSidebar();
//   const location = useLocation();
//   const { user } = useAuthContext();
//   const currentPath = location.pathname;

//   // Pre-fetch data for better UX
//   const { data: documentsData } = useQuery({
//     queryKey: ["documents", user?.organization],
//     queryFn: async () => {
//       if (user?.role === "admin") {
//         const orgs = await organizationService.getOrganizations();
//         const allDocs = await Promise.all(
//           orgs.data.map(async (org: any) => {
//             try {
//               const docs = await documentService.getDocumentsByOrg(org._id);
//               return docs.data || [];
//             } catch {
//               return [];
//             }
//           })
//         );
//         return allDocs.flat();
//       } else {
//         const docs = await documentService.getDocumentsByOrg(
//           user?.organization || ""
//         );
//         return docs.data || [];
//       }
//     },
//     enabled: !!user,
//   });

//   const { data: organizationsData } = useQuery({
//     queryKey: ["organizations"],
//     queryFn: () => organizationService.getOrganizations(),
//     enabled: user?.role === "admin",
//   });

//   const { data: usersData } = useQuery({
//     queryKey: ["allUsers"],
//     queryFn: () => userService.getAllUsers(),
//     enabled: user?.role === "admin",
//   });

//   const { data: userMetrics } = useQuery({
//     queryKey: ["userMetrics"],
//     queryFn: () => userService.getUserMetrics(),
//     enabled: user?.role === "admin",
//   });

//   const { data: orgMetrics } = useQuery({
//     queryKey: ["organizationMetrics"],
//     queryFn: () => organizationService.getOrganizationMetrics(),
//     enabled: user?.role === "admin",
//   });

//   const isActive = (path: string) => currentPath === path;

//   const getNavCls = ({ isActive }: { isActive: boolean }) =>
//     isActive
//       ? "bg-accent text-accent-foreground font-medium"
//       : "hover:bg-accent/50";

//   const allItems =
//     user?.role === "admin" ? [...baseItems, ...adminItems] : baseItems;

//   return (
//     <Sidebar collapsible="icon">
//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarGroupLabel>ContractHub</SidebarGroupLabel>

//           <SidebarGroupContent>
//             <SidebarMenu>
//               {allItems.map((item) => (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton asChild>
//                     <NavLink to={item.url} end className={getNavCls}>
//                       <item.icon className="mr-2 h-4 w-4" />
//                       {state !== "collapsed" && <span>{item.title}</span>}
//                     </NavLink>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//     </Sidebar>
//   );
// }

import { FileText, Building2, Users, BarChart3, Home } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
// import { userService } from "../services/user.service";
import { organizationService } from "../services/organization.service";
import { documentService } from "../services/document.service";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "../components/ui/sidebar";

const baseItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Documents", url: "/documents", icon: FileText },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
];

const adminItems = [
  { title: "Organizations", url: "/organizations", icon: Building2 },
  { title: "Users", url: "/users", icon: Users },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user } = useAuthContext();
  const currentPath = location.pathname;

  // Pre-fetch data (optional, can remove if not needed)
  const { data: documentsData } = useQuery({
    queryKey: ["documents", user?.organization],
    queryFn: async () => {
      if (!user) return [];
      if (user.role === "admin") {
        const orgs = await organizationService.getOrganizations();
        const allDocs = await Promise.all(
          orgs.data.map(async (org: any) => {
            try {
              const docs = await documentService.getDocumentsByOrg(org._id);
              return docs.data || [];
            } catch {
              return [];
            }
          })
        );
        return allDocs.flat();
      } else {
        const docs = await documentService.getDocumentsByOrg(
          user.organization || ""
        );
        return docs.data || [];
      }
    },
    enabled: !!user,
  });

  const allItems =
    user?.role === "admin" ? [...baseItems, ...adminItems] : baseItems;

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-accent text-accent-foreground font-medium"
      : "hover:bg-accent/50";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>ContractHub</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {allItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {/* Use NavLink directly for proper routing */}
                  <NavLink to={item.url} end className={getNavCls}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {state !== "collapsed" && <span>{item.title}</span>}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
