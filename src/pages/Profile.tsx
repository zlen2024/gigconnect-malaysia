import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, LogOut, LayoutDashboard, Pencil, User } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { useToast } from "@/components/ui/use-toast";

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
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="container max-w-md mx-auto p-4 space-y-6">
        <header className="flex justify-between items-center pt-4">
          <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Pencil className="h-5 w-5" />
            <span className="sr-only">Edit Profile</span>
          </Button>
        </header>

        <Card className="border-none shadow-none bg-transparent">
          <CardContent className="flex flex-col items-center gap-4 p-0">
            <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {profile?.full_name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="text-center space-y-1">
              <h2 className="text-xl font-bold">{profile?.full_name || "User"}</h2>
              <p className="text-sm text-muted-foreground">{profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : "User"}</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3 pt-4">
          <Button
            className="w-full justify-start h-12 text-base font-medium"
            variant="secondary"
            asChild
          >
            <Link to={profile?.role === "student" ? "/dashboard/student" : "/dashboard/client"}>
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
            className="w-full justify-start h-12 text-base font-medium text-destructive hover:text-destructive hover:bg-destructive/10"
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
