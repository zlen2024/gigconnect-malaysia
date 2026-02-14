import { Link, useLocation } from "react-router-dom";
import { Home, Briefcase, List, Map, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function DesktopNav() {
  const location = useLocation();
  const path = location.pathname;

  const isActive = (route: string) => {
    if (route === "/") return path === "/";
    return path.startsWith(route);
  };

  const navItems = [
    { label: "Home", icon: Home, route: "/" },
    { label: "Gigs", icon: Briefcase, route: "/gigs" },
    { label: "Requests", icon: List, route: "/requests" },
    { label: "Map", icon: Map, route: "/map" },
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
