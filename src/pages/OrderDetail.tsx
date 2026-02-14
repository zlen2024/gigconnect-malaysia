import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Upload, CheckCircle, PlayCircle, ArrowLeft } from "lucide-react";
import { Chat } from "@/components/Chat";
import { BottomNav } from "@/components/BottomNav";

type Order = Database['public']['Tables']['orders']['Row'];

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;

      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (!user) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching order:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load order.",
        });
        navigate("/dashboard/student"); // Default fallback
      } else {
        // Check access
        if (data.client_id !== user.id && data.student_id !== user.id) {
           toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You do not have permission to view this order.",
          });
          navigate("/");
          return;
        }
        setOrder(data);
      }
      setLoading(false);
    };

    fetchOrder();
  }, [id, navigate, toast]);

  const updateStatus = async (status: Database['public']['Enums']['order_status']) => {
    if (!order) return;
    setActionLoading(true);

    const { error } = await supabase
      .from("orders")
      .update({ status })
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
    // Mock upload
    setActionLoading(true);
    setTimeout(async () => {
        const mockUrl = "https://example.com/receipt.pdf";
        const { error } = await supabase
            .from("orders")
            .update({
                receipt_url: mockUrl,
                status: 'paid'
            })
            .eq("id", order?.id);

        if (!error && order) {
            setOrder({ ...order, receipt_url: mockUrl, status: 'paid' });
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
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isClient = user.id === order.client_id;
  const isStudent = user.id === order.student_id;
  const receiverId = isClient ? order.student_id : order.client_id;

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl pb-20">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 pl-0 hover:bg-transparent hover:text-primary">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details & Actions */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order #{order.id.slice(0, 8)}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                Status: <span className="uppercase font-bold text-primary">{order.status}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Price</span>
                <span className="font-bold text-lg">RM {order.price}</span>
              </div>

              {/* Actions based on role and status */}
              <div className="pt-2">
                {isClient && order.status === 'pending' && (
                  <Button className="w-full" onClick={handleUploadReceipt} disabled={actionLoading}>
                    {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                    Upload Payment Receipt
                  </Button>
                )}

                {isStudent && order.status === 'paid' && (
                  <Button className="w-full" onClick={() => updateStatus('in_progress')} disabled={actionLoading}>
                    {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlayCircle className="mr-2 h-4 w-4" />}
                    Start Work
                  </Button>
                )}

                {isClient && order.status === 'in_progress' && (
                  <Button className="w-full" variant="outline" onClick={() => updateStatus('completed')} disabled={actionLoading}>
                    {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                    Mark as Completed
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
              <Card>
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

        {/* Right Column: Chat */}
        <div className="lg:col-span-2">
            <Chat
                orderId={order.id}
                currentUserId={user.id}
                receiverId={receiverId}
            />
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default OrderDetail;
