import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppHeader } from "@/components/AppHeader";
import { useNavigate } from "react-router-dom";
import { Loader2, MessageSquare, CheckCircle, Briefcase } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

type Order = Database['public']['Tables']['orders']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

type OrderWithRelations = Order & {
  client?: { full_name: string | null } | null;
  student?: { full_name: string | null } | null;
};

// Helper to get status badge color/text
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">Pending</span>;
    case 'in_progress':
      return <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">In Progress</span>;
    case 'submitted':
      return <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">Submitted</span>;
    case 'completed':
      return <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">Completed</span>;
    case 'cancelled':
      return <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">Cancelled</span>;
    default:
      return <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">{status}</span>;
  }
};

const MyProjects = () => {
  const [studentOrders, setStudentOrders] = useState<OrderWithRelations[]>([]);
  const [clientOrders, setClientOrders] = useState<OrderWithRelations[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [clientStats, setClientStats] = useState({ activeOrders: 0, totalInvestment: 0 });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            navigate("/login");
            return;
        }
        setUser(user);

        // Fetch Profile for Student Stats
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch Orders as Student (with client details)
        const { data: sOrders, error: sError } = await supabase
          .from("orders")
          .select(`
            *,
            client:profiles!client_id(full_name)
          `)
          .eq("student_id", user.id)
          .order("created_at", { ascending: false });

        if (sError) throw sError;
        setStudentOrders(sOrders || []);

        // Fetch Orders as Client (with student details)
        const { data: cOrders, error: cError } = await supabase
          .from("orders")
          .select(`
            *,
            student:profiles!student_id(full_name)
          `)
          .eq("client_id", user.id)
          .order("created_at", { ascending: false });

        if (cError) throw cError;
        setClientOrders(cOrders || []);

        // Calculate Client Stats
        if (cOrders) {
            const activeCount = cOrders.filter(o => ['pending', 'in_progress', 'submitted'].includes(o.status)).length;
            const investment = cOrders
                .filter(o => o.status === 'completed')
                .reduce((sum, o) => sum + (o.price || 0), 0);
            setClientStats({ activeOrders: activeCount, totalInvestment: investment });
        }

      } catch (error: any) {
        console.error("Error fetching projects:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load projects."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 font-display">
      <AppHeader title="My Projects" />

      <main className="container mx-auto max-w-4xl px-4 py-6 space-y-8">

        {/* Student Stats Header */}
        {(studentOrders.length > 0 || (profile?.total_done_projects || 0) > 0) && (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Student Overview
                </h2>
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Total Earnings</p>
                        <p className="text-2xl font-black text-primary">RM {profile?.total_earnings?.toFixed(2) || "0.00"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Projects Completed</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">{profile?.total_done_projects || 0}</p>
                    </div>
                </div>
            </div>
        )}

        {/* Client Stats Header */}
        {(clientOrders.length > 0) && (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                 <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
                    <Briefcase className="h-5 w-5 text-blue-500" />
                    Client Overview
                </h2>
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Active Orders</p>
                        <p className="text-2xl font-black text-blue-600">{clientStats.activeOrders}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Total Investment</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">RM {clientStats.totalInvestment.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        )}

        <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="all">All Projects</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
                <ProjectList orders={[...studentOrders, ...clientOrders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())} userId={user?.id || ''} />
            </TabsContent>
            <TabsContent value="active" className="space-y-4">
                 <ProjectList orders={[...studentOrders, ...clientOrders].filter(o => ['pending', 'in_progress', 'submitted'].includes(o.status)).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())} userId={user?.id || ''} />
            </TabsContent>
            <TabsContent value="completed" className="space-y-4">
                 <ProjectList orders={[...studentOrders, ...clientOrders].filter(o => o.status === 'completed' || o.status === 'cancelled').sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())} userId={user?.id || ''} />
            </TabsContent>
        </Tabs>

      </main>
      <BottomNav />
    </div>
  );
};

const ProjectList = ({ orders, userId }: { orders: OrderWithRelations[], userId: string }) => {
    const navigate = useNavigate();

    if (orders.length === 0) {
        return (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                <p className="text-slate-500">No projects found.</p>
            </div>
        );
    }

    return (
        <>
            {orders.map((order) => {
                const isStudent = order.student_id === userId;
                const partnerName = isStudent ? order.client?.full_name : order.student?.full_name;

                return (
                    <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group" onClick={() => navigate(`/orders/${order.id}`)}>
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 bg-slate-50/50 dark:bg-slate-800/50">
                            <div className="space-y-1">
                                <CardTitle className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                                    Project #{order.id.slice(0, 8).toUpperCase()}
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    {isStudent ? 'Client' : 'Student'}: <span className="font-medium text-slate-700 dark:text-slate-300">{partnerName || 'Unknown'}</span>
                                </CardDescription>
                            </div>
                            {getStatusBadge(order.status)}
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Price</p>
                                    <p className="text-lg font-black text-slate-900 dark:text-white">RM {order.price}</p>
                                </div>
                                <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary/10 hover:text-primary" onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/orders/${order.id}`);
                                }}>
                                    <MessageSquare className="h-5 w-5" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </>
    );
};

export default MyProjects;
