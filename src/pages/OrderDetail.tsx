import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, CheckCircle, PlayCircle } from "lucide-react";
import { Database } from "@/types/supabase";
import { Chat } from "@/components/Chat";
import { BottomNav } from "@/components/BottomNav";
import { AppHeader } from "@/components/AppHeader";

type Order = Database['public']['Tables']['orders']['Row'];
type OrderStatus = Database['public']['Enums']['order_status'];

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }
      setUser(user);

      if (!id) return;

      const { data, error } = await supabase
        .from("orders" as any)
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching order",
          description: error.message,
        });
        navigate("/");
      } else if (data) {
        const orderData = data as any;
        if (orderData.client_id !== user.id && orderData.student_id !== user.id) {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You do not have permission to view this order.",
          });
          navigate("/");
          return;
        }
        setOrder(orderData as Order);
      }
      setLoading(false);
    };

    fetchOrder();
  }, [id, navigate, toast]);

  const updateStatus = async (status: OrderStatus) => {
    if (!order) return;
    setActionLoading(true);

    const { error } = await supabase
      .from("orders" as any)
      .update({ status } as any)
      .eq("id", order.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } else {
      setOrder({ ...order, status });
      toast({
        title: "Status Updated",
        description: `Order marked as ${status}.`,
      });
    }
    setActionLoading(false);
  };

  const handleUploadReceipt = async () => {
    setActionLoading(true);
    setTimeout(async () => {
      const mockUrl = "https://example.com/receipt.pdf";
      const { error } = await supabase
        .from("orders" as any)
        .update({
          receipt_url: mockUrl,
          status: 'agreed'
        } as any)
        .eq("id", order?.id);

      if (!error && order) {
        setOrder({ ...order, receipt_url: mockUrl, status: 'agreed' });
        toast({
          title: "Receipt Uploaded",
          description: "Payment verification submitted.",
        });
      }
      setActionLoading(false);
    }, 1500);
  };

  if (loading || !order || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-white/40 dark:bg-slate-900/90 backdrop-blur-sm">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isClient = user.id === order.client_id;
  const isStudent = user.id === order.student_id;
  const receiverId = isClient ? order.student_id : order.client_id;

  return (
    <div className="min-h-screen bg-white/40 dark:bg-slate-900/90 backdrop-blur-sm pb-20">
      <AppHeader title={`Order #${order.id.slice(0, 8)}`} showBack />

      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle>{order.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  Status: <span className="uppercase font-bold text-primary">{order.status}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-bold text-lg">RM {order.price}</span>
                </div>

                <div className="pt-2">
                  {isClient && order.status === 'pending' && (
                    <Button className="w-full" onClick={handleUploadReceipt} disabled={actionLoading}>
                      {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                      Upload Payment Receipt
                    </Button>
                  )}

                  {isStudent && order.status === 'agreed' && (
                    <Button className="w-full" onClick={() => updateStatus('in_progress')} disabled={actionLoading}>
                      {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlayCircle className="mr-2 h-4 w-4" />}
                      Start Work
                    </Button>
                  )}

                  {isStudent && order.status === 'in_progress' && (
                    <Button className="w-full" onClick={() => updateStatus('submitted')} disabled={actionLoading}>
                      {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                      Submit Deliverables
                    </Button>
                  )}

                  {isClient && order.status === 'submitted' && (
                    <Button className="w-full" variant="outline" onClick={() => updateStatus('completed')} disabled={actionLoading}>
                      {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                      Accept & Complete
                    </Button>
                  )}

                  {order.status === 'completed' && (
                    <div className="p-3 bg-green-50 text-green-700 rounded-lg text-center font-bold text-sm border border-green-200">
                      Order Completed
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {order.receipt_url && (
              <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="text-sm">Payment Proof</CardTitle>
                </CardHeader>
                <CardContent>
                  <a href={order.receipt_url} target="_blank" rel="noreferrer" className="text-primary underline text-sm break-all">
                    {order.receipt_url}
                  </a>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-2">
            <Chat
              orderId={order.id}
              currentUserId={user.id}
              receiverId={receiverId}
            />
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default OrderDetail;
