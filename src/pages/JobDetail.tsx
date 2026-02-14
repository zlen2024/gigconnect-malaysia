import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/types/supabase";
import { BottomNav } from "@/components/BottomNav";

type JobWithProfile = Database['public']['Tables']['jobs']['Row'] & {
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [job, setJob] = useState<JobWithProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from("jobs")
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
        setJob(data as any);
      } catch (error) {
        console.error("Error fetching job:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load job details.",
        });
        navigate("/requests");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, navigate, toast]);

  const handleApply = async () => {
    setApplying(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to apply for a job.",
      });
      navigate("/login");
      return;
    }

    if (user.id === job?.user_id) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "You cannot apply to your own job.",
      });
      setApplying(false);
      return;
    }

    if (!job) return;

    // Check if already applied?
    const { data: existing } = await supabase
      .from("orders")
      .select("id")
      .eq("job_id", job.id)
      .eq("student_id", user.id)
      .single();

    if (existing) {
       toast({
        variant: "destructive",
        title: "Already Applied",
        description: "You have already applied to this job.",
      });
      setApplying(false);
      return;
    }

    // Create order (Application)
    const { error } = await supabase
      .from("orders")
      .insert({
        job_id: job.id,
        client_id: job.user_id,
        student_id: user.id,
        price: job.budget,
        status: "pending",
      });

    if (error) {
       toast({
        variant: "destructive",
        title: "Application Failed",
        description: error.message,
      });
    } else {
       toast({
        title: "Success!",
        description: "Application sent successfully.",
      });
      navigate("/dashboard/student");
    }
    setApplying(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="container mx-auto max-w-2xl min-h-screen bg-white/40 dark:bg-slate-900/90 backdrop-blur-sm shadow-xl p-0 pb-24">
      <AppHeader title="Job Details" showBack />

      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">{job.title}</h1>
          <div className="flex items-center gap-2 mb-4">
             <div className="h-8 w-8 rounded-full overflow-hidden bg-slate-200">
                {job.profiles?.avatar_url ? (
                  <img src={job.profiles.avatar_url} alt="Client" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-xs font-bold">
                    {job.profiles?.full_name?.charAt(0) || "C"}
                  </div>
                )}
             </div>
             <span className="font-semibold">{job.profiles?.full_name}</span>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg border">
          <div className="flex justify-between items-center mb-4">
            <span className="text-2xl font-bold text-primary">Budget: RM {job.budget}</span>
            <span className="text-sm text-muted-foreground">Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'No deadline'}</span>
          </div>
          <Button size="lg" className="w-full font-bold" onClick={handleApply} disabled={applying}>
            {applying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply Now"}
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold">Job Description</h3>
          <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
            {job.description}
          </p>
          <div className="pt-4 flex gap-2">
             <span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-500">{job.location}</span>
             <span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-500">{job.category}</span>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default JobDetail;
