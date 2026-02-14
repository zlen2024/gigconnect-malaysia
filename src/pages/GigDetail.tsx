import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/types/supabase";
import { BottomNav } from "@/components/BottomNav";

type GigWithProfile = Database['public']['Tables']['gigs']['Row'] & {
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

const GigDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [gig, setGig] = useState<GigWithProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchGig = async () => {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from("gigs")
          .select(`
            *,
            profiles (
              full_name,
              avatar_url
            )
          `)
          .eq("id", id)
          .single();

        if (error) throw error;
        setGig(data as any);
      } catch (error) {
        console.error("Error fetching gig:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load gig details.",
        });
        navigate("/gigs");
      } finally {
        setLoading(false);
      }
    };

    fetchGig();
  }, [id, navigate, toast]);

  const handleBookNow = async () => {
    setBookingLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to book a gig.",
      });
      navigate("/login");
      return;
    }

    if (user.id === gig?.user_id) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "You cannot book your own gig.",
      });
      setBookingLoading(false);
      return;
    }

    if (!gig) return;

    // Create order
    const { error } = await supabase
      .from("orders")
      .insert({
        gig_id: gig.id,
        client_id: user.id,
        student_id: gig.user_id,
        price: gig.price,
        status: "pending",
      });

    if (error) {
       toast({
        variant: "destructive",
        title: "Booking Failed",
        description: error.message,
      });
    } else {
       toast({
        title: "Success!",
        description: "Gig booked successfully. Check your dashboard.",
      });
      navigate("/dashboard/client");
    }
    setBookingLoading(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!gig) return null;

  return (
    <div className="container mx-auto max-w-2xl min-h-screen bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-xl p-0 pb-24">
      <AppHeader title="Gig Details" showBack />

      <div className="p-6 space-y-6">
        {/* Images */}
        <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden">
           {gig.images && gig.images[0] ? (
             <img src={gig.images[0]} alt={gig.title} className="w-full h-full object-cover" />
           ) : (
             <div className="w-full h-full flex items-center justify-center text-slate-400">
               <span className="material-symbols-outlined text-6xl">image</span>
             </div>
           )}
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">{gig.title}</h1>
          <div className="flex items-center gap-2 mb-4">
             <div className="h-8 w-8 rounded-full overflow-hidden bg-slate-200">
                {gig.profiles?.avatar_url ? (
                  <img src={gig.profiles.avatar_url} alt="User" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-xs font-bold">
                    {gig.profiles?.full_name?.charAt(0) || "U"}
                  </div>
                )}
             </div>
             <span className="font-semibold">{gig.profiles?.full_name}</span>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg border">
          <div className="flex justify-between items-center mb-4">
            <span className="text-2xl font-bold text-primary">RM {gig.price}</span>
            <span className="text-sm text-muted-foreground">{gig.delivery_time} Days Delivery</span>
          </div>
          <Button size="lg" className="w-full font-bold" onClick={handleBookNow} disabled={bookingLoading}>
            {bookingLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Book Now"}
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold">About This Gig</h3>
          <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
            {gig.description}
          </p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default GigDetail;
