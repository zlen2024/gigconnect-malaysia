import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const DashboardRedirect = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "student") {
        navigate("/dashboard/student");
      } else if (profile?.role === "client") {
        navigate("/dashboard/client");
      } else {
        // Fallback or error for admin/other
        navigate("/");
      }
      setLoading(false);
    };

    checkRole();
  }, [navigate]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-white/40 dark:bg-slate-900/90 backdrop-blur-sm">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};

export default DashboardRedirect;
