import { Link, useLocation } from "react-router-dom";
import { Briefcase, List, Folder, User, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

export function DesktopNav() {
  const location = useLocation();
  const path = location.pathname;

  const isActive = (route: string) => {
    if (route === "/") return path === "/";
    return path.startsWith(route);
  };

  const navItems = [
    { label: "Gigs", icon: Briefcase, route: "/gigs" },
    { label: "Requests", icon: List, route: "/requests" },
    { label: "Dashboard", icon: LayoutDashboard, route: "/dashboard" },
    { label: "My Projects", icon: Folder, route: "/projects" },
    { label: "Profile", icon: User, route: "/profile" },
  ];

  return (
    <nav className="hidden md:flex items-center gap-6 mx-6">
      {navItems.map((item) => {
        const active = isActive(item.route);
        return (
          <Link
            key={item.label}
            to={item.route}
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
              active ? "text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
