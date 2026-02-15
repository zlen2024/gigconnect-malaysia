import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, LogOut, LayoutDashboard, Pencil, User } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { useToast } from "@/components/ui/use-toast";
import { AppHeader } from "@/components/AppHeader";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        toast({
          variant: "destructive",
          title: "Error fetching profile",
          description: "Could not load user data.",
        });
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error logging out",
        description: error.message,
      });
    } else {
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white/40 dark:bg-slate-900/90 backdrop-blur-sm">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white/40 dark:bg-slate-900/90 backdrop-blur-sm pb-20">
      <AppHeader
        title="Profile"
        action={
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            <Pencil className="h-5 w-5 text-slate-700 dark:text-slate-300" />
            <span className="sr-only">Edit Profile</span>
          </Button>
        }
      />

      <div className="container max-w-md mx-auto p-4 space-y-6 pt-6">
        <Card className="border-none shadow-none bg-transparent">
          <CardContent className="flex flex-col items-center gap-4 p-0">
            <Avatar className="h-24 w-24 border-4 border-white dark:border-slate-800 shadow-xl">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {profile?.full_name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="text-center space-y-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{profile?.full_name || "User"}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{profile?.full_name ? "Member" : "User"}</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3 pt-4">
          <Button
            className="w-full justify-start h-12 text-base font-medium"
            variant="secondary"
            asChild
          >
            <Link to="/dashboard/student">
              <LayoutDashboard className="mr-3 h-5 w-5 text-primary" />
              Dashboard
            </Link>
          </Button>

           {/* Placeholder for future features */}
           <Button
            className="w-full justify-start h-12 text-base font-medium"
            variant="outline"
          >
            <User className="mr-3 h-5 w-5 text-muted-foreground" />
            Account Settings
          </Button>

          <Button
            className="w-full justify-start h-12 text-base font-medium text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
            variant="outline"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Log Out
          </Button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Profile;
