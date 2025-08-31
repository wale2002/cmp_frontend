// import type { ReactNode } from "react";
// import { Button } from "../components/ui/button";
// import {
//   FileText,
//   Building,
//   Users,
//   BarChart3,
//   LogOut,
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   Menu,
//   Shield,
// } from "lucide-react";

// // import {
// //   SidebarProvider,
// //   SidebarTrigger,
// //   SidebarInset,
// // } from "../components/ui/sidebar";
// // import { AppSidebar } from "../components/AppSidebar";

// interface LayoutProps {
//   children: ReactNode;
//   user?: {
//     username: string;
//     role: string;
//     organization: string;
//   };
//   onLogout?: () => void;
// }

// const Layout = ({ children, user, onLogout }: LayoutProps) => {
//   const isAdmin = user?.role === "admin";

//   return (
//     <>
//       <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
//         {/* Header */}
//         <header className="border-b bg-card shadow-soft">
//           <div className="container mx-auto px-6 py-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="flex items-center gap-2">
//                   <Shield className="h-8 w-8 text-primary" />
//                   <h1 className="text-2xl font-bold text-primary">
//                     ContractHub
//                   </h1>
//                 </div>
//                 {user && (
//                   <div className="hidden md:block ml-8">
//                     <span className="text-sm text-muted-foreground">
//                       Welcome back,{" "}
//                       <span className="font-medium text-foreground">
//                         {user.username}
//                       </span>
//                     </span>
//                   </div>
//                 )}
//               </div>

//               {user && (
//                 <div className="flex items-center gap-4">
//                   <div className="hidden md:flex items-center gap-2 text-sm">
//                     <span className="text-muted-foreground">Role:</span>
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         isAdmin
//                           ? "bg-primary-light text-primary"
//                           : "bg-secondary text-secondary-foreground"
//                       }`}
//                     >
//                       {user.role}
//                     </span>
//                   </div>
//                   <Button variant="ghost" size="sm" onClick={onLogout}>
//                     <LogOut className="h-4 w-4 mr-2" />
//                     Logout
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </header>

//         <div className="flex min-h-[calc(100vh-73px)]">
//           {/* Sidebar */}
//           {user && (
//             <aside className="w-64 bg-card border-r shadow-soft">
//               <nav className="p-6 space-y-2">
//                 <Button variant="ghost" className="w-full justify-start">
//                   <FileText className="h-4 w-4 mr-3" />
//                   Documents
//                 </Button>

//                 <Button variant="ghost" className="w-full justify-start">
//                   <BarChart3 className="h-4 w-4 mr-3" />
//                   Analytics
//                 </Button>

//                 {isAdmin && (
//                   <>
//                     <div className="pt-4 pb-2">
//                       <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
//                         Admin
//                       </h3>
//                     </div>

//                     <Button variant="ghost" className="w-full justify-start">
//                       <Building className="h-4 w-4 mr-3" />
//                       Organizations
//                     </Button>

//                     <Button variant="ghost" className="w-full justify-start">
//                       <Users className="h-4 w-4 mr-3" />
//                       Users
//                     </Button>
//                   </>
//                 )}
//               </nav>
//             </aside>
//           )}

//           {/* Main Content */}
//           <main className="flex-1 p-6">{children}</main>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Layout;

import type { ReactNode } from "react";
import { Button } from "../components/ui/button";
import {
  FileText,
  Building,
  Users,
  BarChart3,
  LogOut,
  Shield,
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
  user?: {
    username: string;
    role: string;
    organization: string;
  };
  onLogout?: () => void;
}

const Layout = ({ children, user, onLogout }: LayoutProps) => {
  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Header */}
      <header className="border-b bg-card shadow-soft">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <NavLink to="/dashboard">
                <div className="flex items-center gap-2">
                  <Shield className="h-8 w-8 text-primary" />
                  <h1 className="text-2xl font-bold text-primary">
                    ContractHub
                  </h1>
                </div>
              </NavLink>
              {user && (
                <div className="hidden md:block ml-8">
                  <span className="text-sm text-muted-foreground">
                    Welcome back,{" "}
                    <span className="font-medium text-foreground">
                      {user.username}
                    </span>
                  </span>
                </div>
              )}
            </div>

            {user && (
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Role:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isAdmin
                        ? "bg-primary-light text-primary"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={onLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-73px)]">
        {/* Sidebar */}
        {user && (
          <aside className="w-64 bg-card border-r shadow-soft">
            <nav className="p-6 space-y-2">
              <NavLink
                to="/documents"
                className={({ isActive }) =>
                  `w-full flex items-center px-3 py-2 rounded-md transition ${
                    isActive
                      ? "bg-accent text-accent-foreground font-medium"
                      : "hover:bg-accent/50"
                  }`
                }
              >
                <FileText className="h-4 w-4 mr-3" />
                Documents
              </NavLink>

              <NavLink
                to="/analytics"
                className={({ isActive }) =>
                  `w-full flex items-center px-3 py-2 rounded-md transition ${
                    isActive
                      ? "bg-accent text-accent-foreground font-medium"
                      : "hover:bg-accent/50"
                  }`
                }
              >
                <BarChart3 className="h-4 w-4 mr-3" />
                Analytics
              </NavLink>

              {isAdmin && (
                <>
                  <div className="pt-4 pb-2">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Admin
                    </h3>
                  </div>

                  <NavLink
                    to="/organizations"
                    className={({ isActive }) =>
                      `w-full flex items-center px-3 py-2 rounded-md transition ${
                        isActive
                          ? "bg-accent text-accent-foreground font-medium"
                          : "hover:bg-accent/50"
                      }`
                    }
                  >
                    <Building className="h-4 w-4 mr-3" />
                    Organizations
                  </NavLink>

                  <NavLink
                    to="/users"
                    className={({ isActive }) =>
                      `w-full flex items-center px-3 py-2 rounded-md transition ${
                        isActive
                          ? "bg-accent text-accent-foreground font-medium"
                          : "hover:bg-accent/50"
                      }`
                    }
                  >
                    <Users className="h-4 w-4 mr-3" />
                    Users
                  </NavLink>
                </>
              )}
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
