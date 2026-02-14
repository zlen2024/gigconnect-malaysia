import { Link, useLocation } from "react-router-dom";
import { Briefcase, List, Folder, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const location = useLocation();
  const path = location.pathname;

  const isActive = (route: string) => {
    if (route === "/") return path === "/";
    return path.startsWith(route);
  };

  const navItems = [
    { label: "Gigs", icon: Briefcase, route: "/gigs" },
    { label: "Requests", icon: List, route: "/requests" },
    { label: "My Projects", icon: Folder, route: "/projects" },
    { label: "Profile", icon: User, route: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-4 py-2 z-50 pb-safe md:hidden">
      <div className="flex items-center justify-between h-14">
        {navItems.map((item) => {
          const active = isActive(item.route);
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.route}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-colors min-w-[3.5rem]",
                active
                  ? "text-primary"
                  : "text-slate-400 hover:text-primary dark:text-slate-500"
              )}
            >
              <Icon
                className={cn("h-6 w-6 transition-all", active ? "scale-110" : "scale-100")}
                strokeWidth={active ? 2.5 : 2}
              />
              <span className={cn("text-[10px]", active ? "font-bold" : "font-medium")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      {/* iOS Safe Area Spacer - using pb-safe if supported or explicit div */}
      <div className="h-safe-bottom md:hidden"></div>
    </nav>
  );
}
