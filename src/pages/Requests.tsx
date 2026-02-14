import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { AppHeader } from "@/components/AppHeader";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JobWithProfile {
  id: string;
  title: string;
  category: string;
  budget: number;
  description: string;
  location: string;
  deadline: string;
  status: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

const Requests = () => {
  const [jobs, setJobs] = useState<JobWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
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
        .eq('status', 'open') // Only show open jobs
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJobs(data as any);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="font-display text-slate-900 dark:text-slate-100 antialiased min-h-screen">
      {/* Main Container */}
      <div className="relative flex min-h-screen w-full max-w-md mx-auto flex-col bg-white/40 dark:bg-slate-900/90 backdrop-blur-sm shadow-2xl overflow-x-hidden pb-20">
        <AppHeader title="SiswaGig" />

        {/* Search & Map Preview Section */}
        <div className="px-4 pt-5 pb-2 space-y-4">
          {/* Search Bar */}
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-4 text-slate-400">search</span>
            <input
              className="w-full h-12 pl-12 pr-4 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/50 placeholder:text-slate-400"
              placeholder="Search jobs or locations"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filters Tabs */}
        <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar">
          {["All", "Design", "Tutoring", "Manual Labor", "Tech Support"].map((cat) => (
             <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Request Feed */}
        <main className="flex-1 px-4 space-y-4 pb-4 overflow-y-auto">
          {loading ? (
             <div className="flex justify-center py-12">
               <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
          ) : (
            filteredJobs.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  No jobs found matching your criteria.
                </div>
            ) : (
              filteredJobs.map((job) => (
                <Link to={`/requests/${job.id}`} key={job.id}>
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow mb-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-primary text-lg font-bold tracking-tight">RM {job.budget}</span>
                        </div>
                        <h3 className="text-slate-900 dark:text-white font-bold text-base leading-snug">
                          {job.title}
                        </h3>
                        <div className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400 pt-1">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">location_on</span>
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : "No deadline"}
                          </span>
                        </div>
                      </div>
                      <div className="size-12 rounded-full overflow-hidden shrink-0 border border-slate-200">
                        {job.profiles?.avatar_url ? (
                          <img
                            alt={job.profiles.full_name || "Client"}
                            className="size-full object-cover"
                            src={job.profiles.avatar_url}
                          />
                        ) : (
                          <div className="size-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                            {job.profiles?.full_name?.charAt(0) || "C"}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button className="mt-4 w-full h-10 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-bold transition-all">
                      Apply Now
                    </Button>
                  </div>
                </Link>
              ))
            )
          )}
        </main>

        <BottomNav />
      </div>
    </div>
  );
};

export default Requests;
