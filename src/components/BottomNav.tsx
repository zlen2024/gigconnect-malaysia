import { Link, useLocation } from "react-router-dom";

export function BottomNav() {
  const location = useLocation();
  const path = location.pathname;

  const isActive = (route: string) => {
      // Exact match for root, prefix match for others if needed, but for now exact is safer for these pages
      // actually, if I go to /gigs/123 I want Gigs to be active.
      if (route === "/") return path === "/";
      return path.startsWith(route);
  };

  const navItems = [
    { label: "Home", icon: "home", route: "/" },
    { label: "Gigs", icon: "work", route: "/gigs" },
    { label: "Requests", icon: "list_alt", route: "/requests" },
    { label: "Map", icon: "map", route: "/map" },
    { label: "Profile", icon: "person", route: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-4 py-2 z-50">
      <div className="flex items-center justify-between h-14">
        {navItems.map((item) => {
          const active = isActive(item.route);
          return (
            <Link
              key={item.label}
              to={item.route}
              className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
                active
                  ? "text-primary active-nav"
                  : "text-slate-400 hover:text-primary dark:text-slate-500"
              }`}
            >
              <span className={`material-symbols-outlined text-2xl ${active ? "active-icon" : ""}`}>
                {item.icon}
              </span>
              <span className={`text-[10px] ${active ? "font-bold" : "font-medium"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      {/* iOS Safe Area Spacer */}
      <div className="h-4"></div>
    </nav>
  );
}
