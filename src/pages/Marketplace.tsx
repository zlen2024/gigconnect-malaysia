import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { AppHeader } from "@/components/AppHeader";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

// Types
interface Profile {
  full_name: string | null;
  avatar_url: string | null;
  role?: string;
}

interface Gig {
  id: string;
  title: string;
  category: string;
  price: number;
  description: string;
  images: string[] | null;
  profiles: Profile | null;
}

interface Job {
  id: string;
  title: string;
  category: string;
  budget: number;
  description: string;
  location: string | null;
  deadline: string | null;
  status: string | null;
  profiles: Profile | null;
}

const Marketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "gigs";

  const [gigs, setGigs] = useState<Gig[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Gigs
      const { data: gigsData, error: gigsError } = await supabase
        .from("gigs")
        .select(`
          *,
          profiles (
            full_name,
            avatar_url,
            role
          )
        `)
        .order("created_at", { ascending: false });

      if (gigsError) throw gigsError;
      setGigs(gigsData as unknown as Gig[]);

      // Fetch Jobs
      const { data: jobsData, error: jobsError } = await supabase
        .from("jobs")
        .select(`
          *,
          profiles (
            full_name,
            avatar_url
          )
        `)
        .eq('status', 'open')
        .order("created_at", { ascending: false });

      if (jobsError) throw jobsError;
      setJobs(jobsData as unknown as Job[]);

    } catch (error) {
      console.error("Error fetching marketplace data:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", "Design", "Tutoring", "Tech", "Delivery", "Household"];

  const filterData = (data: (Gig | Job)[]) => {
    return data.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  const filteredGigs = filterData(gigs);
  const filteredJobs = filterData(jobs);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 font-display">
      <AppHeader title="Marketplace" />

      <main className="container mx-auto p-4 md:p-8">
        {/* Search & Filter */}
        <div className="flex gap-2 mb-4 max-w-md mx-auto md:mx-0">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    className="pl-9 bg-white dark:bg-slate-800"
                    placeholder="Search services or jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Button variant="outline" size="icon" className="bg-white dark:bg-slate-800">
                <Filter className="h-4 w-4" />
            </Button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
                        selectedCategory === cat
                        ? "bg-primary text-white border-primary"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary/50"
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>

        <Tabs defaultValue={defaultTab} className="w-full" onValueChange={(val) => setSearchParams({ tab: val })}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="gigs">Gigs Wall</TabsTrigger>
                <TabsTrigger value="requests">Requests Wall</TabsTrigger>
            </TabsList>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <>
                    <TabsContent value="gigs" className="space-y-4">
                         {filteredGigs.length === 0 ? (
                            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-dashed">
                                <p className="text-muted-foreground">No gigs found.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredGigs.map((gig) => (
                                    <Link to={`/gigs/${gig.id}`} key={gig.id}>
                                        <div className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all h-full flex flex-col">
                                            <div className="relative aspect-video bg-slate-200 dark:bg-slate-700">
                                                {gig.images && gig.images[0] ? (
                                                    <img alt={gig.title} className="w-full h-full object-cover" src={gig.images[0]} />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-slate-400">
                                                        <span className="material-symbols-outlined text-4xl">image</span>
                                                    </div>
                                                )}
                                                <div className="absolute bottom-2 left-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-primary">
                                                    {gig.category}
                                                </div>
                                            </div>
                                            <div className="p-4 flex-1 flex flex-col">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">{gig.title}</h3>
                                                    <span className="font-bold text-primary whitespace-nowrap ml-2">RM {gig.price}</span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-auto pt-3 border-t border-slate-100 dark:border-slate-700">
                                                    <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                                                        {gig.profiles?.avatar_url ? (
                                                            <img src={gig.profiles.avatar_url} alt={gig.profiles.full_name || "User"} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                                {gig.profiles?.full_name?.charAt(0) || "U"}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400 truncate max-w-[150px]">
                                                        {gig.profiles?.full_name || "Unknown User"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="requests" className="space-y-4">
                        {filteredJobs.length === 0 ? (
                            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-dashed">
                                <p className="text-muted-foreground">No requests found.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredJobs.map((job) => (
                                    <Link to={`/requests/${job.id}`} key={job.id}>
                                        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all h-full flex flex-col">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">{job.category}</span>
                                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                                            {job.location || "Remote"}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{job.title}</h3>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <span className="block text-xl font-black text-slate-900 dark:text-white">RM {job.budget}</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
                                                {job.description}
                                            </p>
                                            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700 mt-auto">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                                                        {job.profiles?.avatar_url ? (
                                                            <img src={job.profiles.avatar_url} alt={job.profiles.full_name || "Client"} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                                {job.profiles?.full_name?.charAt(0) || "C"}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                                        {job.profiles?.full_name || "Client"}
                                                    </span>
                                                </div>
                                                <Button size="sm" variant="secondary" className="h-8 text-xs">Apply Now</Button>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </>
            )}
        </Tabs>
      </main>
      <BottomNav />
    </div>
  );
};

export default Marketplace;
