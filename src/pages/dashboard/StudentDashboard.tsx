import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostGigForm } from "@/components/dashboard/PostGigForm";
import { AppHeader } from "@/components/AppHeader";
import { Link } from "react-router-dom";
import { Loader2, Plus } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

type Gig = Database['public']['Tables']['gigs']['Row'];
type Order = Database['public']['Tables']['orders']['Row'];

const StudentDashboard = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (!user) return;

      const { data: gigsData } = await supabase
        .from("gigs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (gigsData) setGigs(gigsData);

      const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .eq("student_id", user.id)
        .order("created_at", { ascending: false });

      if (ordersData) setOrders(ordersData);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-screen bg-white/40 dark:bg-slate-900/90 backdrop-blur-sm shadow-xl p-0 pb-24">
      <AppHeader title="Dashboard" />

      <div className="p-6 space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
            <p className="text-muted-foreground">Manage your gigs and orders</p>
          </div>
          <PostGigForm onSuccess={fetchData} />
        </header>

        <Tabs defaultValue="gigs" className="w-full">
        <TabsList>
          <TabsTrigger value="gigs">My Gigs</TabsTrigger>
          <TabsTrigger value="orders">Incoming Orders</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
        </TabsList>

        <TabsContent value="gigs" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.length === 0 ? (
              <div className="col-span-full text-center py-12 border rounded-lg bg-muted/20">
                <p className="text-muted-foreground">You haven't posted any gigs yet.</p>
              </div>
            ) : (
              gigs.map((gig) => (
                <Card key={gig.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{gig.title}</CardTitle>
                    <CardDescription>{gig.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-primary">RM {gig.price}</span>
                      <span className="text-sm text-muted-foreground">{gig.delivery_time} days</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <div className="space-y-4">
             {orders.length === 0 ? (
              <div className="text-center py-12 border rounded-lg bg-muted/20">
                <p className="text-muted-foreground">No incoming orders yet.</p>
              </div>
            ) : (
              orders.map((order) => (
                <Card key={order.id} className="relative">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-base">Order #{order.id.slice(0,8)}</CardTitle>
                            <CardDescription>Status: <span className="uppercase font-bold text-primary">{order.status}</span></CardDescription>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link to={`/orders/${order.id}`}>View Details</Link>
                        </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">RM {order.price}</span>
                      <span className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="earnings">
           <Card>
            <CardHeader>
              <CardTitle>Total Earnings</CardTitle>
              <CardDescription>Estimated earnings based on completed orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">RM 0.00</div>
              <p className="text-xs text-muted-foreground mt-2">Mock data for MVP</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
      <BottomNav />
    </div>
  );
};

export default StudentDashboard;
