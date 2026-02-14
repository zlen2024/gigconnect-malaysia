import { Home, Briefcase, Map, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const items = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Briefcase, label: "Gigs", href: "/gigs" },
  { icon: Map, label: "Map", href: "/map" },
  { icon: User, label: "Profile", href: "/profile" },
];

export function MobileBottomNav() {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border px-4 py-2 flex items-center justify-around md:hidden">
      {items.map((item) => {
        const active = location.pathname === item.href;
        return (
          <Link
            key={item.label}
            to={item.href}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              active ? "text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-bold">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
