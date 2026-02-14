import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, CheckCircle, Clock, Lock, Star, MessageSquare } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import { Chat } from "@/components/Chat";
import { BottomNav } from "@/components/BottomNav";
import { AppHeader } from "@/components/AppHeader";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { User } from "@supabase/supabase-js";

type Order = Database['public']['Tables']['orders']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [otherParty, setOtherParty] = useState<Profile | null>(null);
  const [submissionLink, setSubmissionLink] = useState("");

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
        .from("orders")
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
      } else {
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

        // Fetch other party profile
        const otherId = user.id === data.client_id ? data.student_id : data.client_id;
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", otherId)
          .single();

        if (profileData) setOtherParty(profileData);
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

  const handleStartWork = async () => {
    updateStatus('in_progress');
  };

  const handleSubmitWork = async () => {
    if (!submissionLink) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Please enter a submission link or file URL.",
        });
        return;
    }
    setActionLoading(true);

    const { error } = await supabase
      .from("orders")
      .update({
          status: 'submitted',
          submission_url: submissionLink
      })
      .eq("id", order?.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error submitting work",
        description: error.message,
      });
    } else {
       if (order) setOrder({ ...order, status: 'submitted', submission_url: submissionLink });
       toast({
        title: "Work Submitted",
        description: "Your work has been submitted for verification.",
      });
    }
    setActionLoading(false);
  };

  const handlePayAndComplete = async () => {
    if (!order) return;
    setActionLoading(true);

    // Call the RPC function to complete order and update stats securely
    const { error } = await supabase.rpc('complete_order', { order_id: order.id });

    if (error) {
        toast({
            variant: "destructive",
            title: "Error completing order",
            description: error.message
        });
    } else {
        setOrder({ ...order, status: 'completed' });
        toast({
            title: "Order Completed",
            description: "Payment released and project closed."
        });
    }
    setActionLoading(false);
  };

  const handleSubmitReview = async () => {
    if (!order || !user || !otherParty) return;
    setActionLoading(true);

    const { error } = await supabase
      .from("reviews")
      .insert({
        order_id: order.id,
        reviewer_id: user.id,
        reviewee_id: otherParty.id,
        rating,
        comment: reviewText
      });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error submitting review",
        description: error.message
      });
    } else {
      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!"
      });
      setReviewText("");
    }
    setActionLoading(false);
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

  // State Logic Helpers
  const isAgreed = ['in_progress', 'submitted', 'completed'].includes(order.status || '');
  const isInProgress = ['in_progress', 'submitted', 'completed'].includes(order.status || '');
  const isSubmitted = ['submitted', 'completed'].includes(order.status || '');
  const isCompleted = order.status === 'completed';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 font-display">
      <AppHeader title="Project Timeline" showBack />

      <main className="container mx-auto max-w-5xl px-4 py-8">
        {/* Project Header Card */}
        <div className="mb-10 flex flex-col gap-6 rounded-xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 md:flex-row md:items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                isCompleted ? "bg-green-100 text-green-700" : "bg-primary/10 text-primary"
              }`}>
                {isCompleted ? "Completed" : "Active Gig"}
              </span>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">ID: {order.id.slice(0, 8).toUpperCase()}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
               Project #{order.id.slice(0,4)}
            </h1>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              {isClient ? `Student: ${otherParty?.full_name || 'Unknown'}` : `Client: ${otherParty?.full_name || 'Unknown'}`}
            </p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Budget</p>
                <p className="text-2xl font-black text-primary">RM {order.price}</p>
             </div>
             {/* Chat Trigger could go here, but strictly following timeline design */}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Timeline */}
            <div className="lg:col-span-2 relative">
                {/* Timeline Connector Line */}
                <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700 md:left-8"></div>

                {/* Phase 1: Agreed */}
                <div className="relative mb-12 pl-16 md:pl-24">
                    <div className={`absolute left-0 md:left-2 top-0 z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-slate-50 dark:border-slate-900 shadow-sm ${
                        isAgreed ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                    }`}>
                        <CheckCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className={`text-xl font-bold ${isAgreed ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>Phase 1: Agreed</h3>
                        <p className="text-slate-500 text-sm mb-4">Contract signed & budget escrowed.</p>

                        {order.status === 'pending' && isStudent && (
                             <Button onClick={handleStartWork} disabled={actionLoading} size="sm">
                                {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />}
                                Accept & Start Work
                             </Button>
                        )}
                         {order.status === 'pending' && isClient && (
                             <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg inline-block">
                                Waiting for student to accept.
                             </div>
                        )}
                    </div>
                </div>

                {/* Phase 2: Execution */}
                <div className="relative mb-12 pl-16 md:pl-24">
                    <div className={`absolute left-0 md:left-2 top-0 z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-slate-50 dark:border-slate-900 shadow-sm ${
                        isInProgress ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                    }`}>
                        <Clock className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className={`text-xl font-bold ${isInProgress ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>Phase 2: In-Progress</h3>
                        <p className="text-slate-500 text-sm mb-4">Execution and development phase.</p>

                        {order.status === 'in_progress' && (
                            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                                {isStudent ? (
                                    <div className="space-y-3">
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">You are working on this project.</p>
                                        <div className="space-y-2">
                                            <Input
                                                placeholder="Paste link to your work (Google Drive, GitHub, etc.)"
                                                value={submissionLink}
                                                onChange={(e) => setSubmissionLink(e.target.value)}
                                            />
                                            <Button onClick={handleSubmitWork} disabled={actionLoading} className="w-full">
                                                {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                                Submit Work
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Student is working...</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Phase 3: Submission */}
                <div className="relative mb-12 pl-16 md:pl-24">
                     <div className={`absolute left-0 md:left-2 top-0 z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-slate-50 dark:border-slate-900 shadow-sm ${
                        isSubmitted ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                    }`}>
                        <Upload className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className={`text-xl font-bold ${isSubmitted ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>Phase 3: Submission</h3>
                        <p className="text-slate-500 text-sm mb-4">Final deliverables submitted.</p>

                        {order.status === 'submitted' && (
                            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                                <p className="text-sm font-semibold mb-2">Work has been submitted.</p>
                                {order.submission_url && (
                                    <div className="mb-3 p-3 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 break-all">
                                        <a href={order.submission_url} target="_blank" rel="noreferrer" className="text-primary hover:underline text-sm flex items-center gap-2">
                                            <Upload className="h-4 w-4" />
                                            View Submission
                                        </a>
                                    </div>
                                )}
                                {isClient ? (
                                    <p className="text-xs text-slate-500">Please review the work before proceeding to payment.</p>
                                ) : (
                                    <p className="text-xs text-slate-500">Waiting for client verification.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Phase 4: Payment */}
                <div className="relative mb-12 pl-16 md:pl-24">
                    <div className={`absolute left-0 md:left-2 top-0 z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-slate-50 dark:border-slate-900 shadow-sm ${
                        isCompleted ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                    }`}>
                        <Lock className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className={`text-xl font-bold ${isCompleted ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>Phase 4: Payment</h3>
                        <p className="text-slate-500 text-sm mb-4">Fund release and project completion.</p>

                        {order.status === 'submitted' && isClient && (
                            <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                                <Button onClick={handlePayAndComplete} disabled={actionLoading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold">
                                    {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                                    Pay & Complete Project
                                </Button>
                                <p className="text-[10px] text-center text-green-700 mt-2">Funds will be released to the student immediately.</p>
                            </div>
                        )}
                         {order.status === 'submitted' && isStudent && (
                            <div className="text-sm text-slate-500 bg-slate-100 p-3 rounded-lg inline-block">
                                Waiting for client payment.
                            </div>
                        )}
                    </div>
                </div>

                 {/* Phase 5: Closing */}
                 <div className="relative mb-12 pl-16 md:pl-24">
                    <div className={`absolute left-0 md:left-2 top-0 z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-slate-50 dark:border-slate-900 shadow-sm ${
                        isCompleted ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                    }`}>
                        <Star className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className={`text-xl font-bold ${isCompleted ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>Phase 5: Closing</h3>
                        <p className="text-slate-500 text-sm mb-4">Leave feedback and ratings.</p>

                        {isCompleted && (
                            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm">
                                <p className="mb-3 text-sm font-semibold text-slate-800 dark:text-white">Leave a Review</p>
                                <div className="flex gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} onClick={() => setRating(star)} type="button">
                                            <Star className={`h-6 w-6 ${star <= rating ? "text-amber-400 fill-amber-400" : "text-slate-300"}`} />
                                        </button>
                                    ))}
                                </div>
                                <Textarea
                                    className="mb-3"
                                    placeholder="Share your experience..."
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                />
                                <Button onClick={handleSubmitReview} disabled={actionLoading} variant="secondary" className="w-full">
                                    Submit Review
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Right: Chat */}
            <div className="lg:col-span-1">
                 <div className="sticky top-24">
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm mb-6">
                        <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-primary" />
                            Project Chat
                        </h4>
                        <div className="h-[500px] flex flex-col">
                             <Chat
                                orderId={order.id}
                                currentUserId={user.id}
                                receiverId={receiverId}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default OrderDetail;
