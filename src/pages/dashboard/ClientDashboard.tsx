import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostJobForm } from "@/components/dashboard/PostJobForm";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

type Job = Database['public']['Tables']['jobs']['Row'];
type Order = Database['public']['Tables']['orders']['Row'];

const ClientDashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (!user) return;

      const { data: jobsData } = await supabase
        .from("jobs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (jobsData) setJobs(jobsData);

      const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .eq("client_id", user.id)
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
    <div className="container mx-auto p-6 space-y-8 pb-24">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Client Dashboard</h1>
          <p className="text-muted-foreground">Manage your job postings and active orders</p>
        </div>
        <PostJobForm onSuccess={fetchData} />
      </header>

      <Tabs defaultValue="jobs" className="w-full">
        <TabsList>
          <TabsTrigger value="jobs">My Job Postings</TabsTrigger>
          <TabsTrigger value="orders">Active Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.length === 0 ? (
              <div className="col-span-full text-center py-12 border rounded-lg bg-muted/20">
                <p className="text-muted-foreground">You haven't posted any jobs yet.</p>
              </div>
            ) : (
              jobs.map((job) => (
                <Card key={job.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <CardDescription>{job.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-primary">Budget: RM {job.budget}</span>
                      <span className="text-xs uppercase bg-secondary px-2 py-1 rounded">{job.status}</span>
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
                <p className="text-muted-foreground">No active orders.</p>
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
      </Tabs>
      <BottomNav />
    </div>
  );
};

export default ClientDashboard;
