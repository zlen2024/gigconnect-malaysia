import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { DesktopNav } from "@/components/DesktopNav";

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  action?: React.ReactNode;
  className?: string;
}

export function AppHeader({ title, showBack, action, className = "" }: AppHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className={`sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-3 border-b border-slate-100 dark:border-slate-800 transition-colors ${className}`}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-slate-100 dark:hover:bg-slate-800 -ml-2"
            >
              <ArrowLeft className="h-5 w-5 text-slate-700 dark:text-slate-300" />
              <span className="sr-only">Back</span>
            </Button>
          ) : (
            <Link to="/" className="size-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20 shrink-0">
               <span className="material-symbols-outlined text-primary">rocket_launch</span>
            </Link>
          )}

          {title && (
            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-none">
              {title}
            </h1>
          )}
        </div>

        <DesktopNav />

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {action}
        </div>
      </div>
    </header>
  );
}
