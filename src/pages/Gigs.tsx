import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { AppHeader } from "@/components/AppHeader";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface GigWithProfile {
  id: string;
  title: string;
  category: string;
  price: number;
  description: string;
  images: string[] | null;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
    role: string;
  } | null;
}

const Gigs = () => {
  const [gigs, setGigs] = useState<GigWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async () => {
    try {
      const { data, error } = await supabase
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

      if (error) throw error;
      setGigs(data as any); // Type assertion for joined data
    } catch (error) {
      console.error("Error fetching gigs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGigs = gigs.filter((gig) => {
    const matchesSearch = gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          gig.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || gig.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="text-slate-900 dark:text-slate-100 antialiased min-h-screen">
      {/* Main Container */}
      <div className="relative flex min-h-screen w-full flex-col container mx-auto bg-white/40 dark:bg-slate-900/90 backdrop-blur-sm shadow-xl overflow-hidden pb-20 md:pb-0">
        <AppHeader title="SiswaGig" />

        {/* Search Bar */}
        <div className="px-4 pt-4">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-4 text-slate-400">search</span>
            <input
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-500"
              placeholder="Search for services or skills"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Categories Chips */}
        <div className="flex gap-2 overflow-x-auto px-4 py-4 hide-scrollbar">
          {["All", "Design", "Tutoring", "Tech", "Delivery"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex shrink-0 items-center justify-center rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gigs Wall Content */}
        <main className="flex-1 px-4 pb-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Featured Services</h2>
          </div>

          {loading ? (
             <div className="flex justify-center py-12">
               <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGigs.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  No gigs found matching your criteria.
                </div>
              ) : (
                filteredGigs.map((gig) => (
                  <Link to={`/gigs/${gig.id}`} key={gig.id}>
                    <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 transition-transform active:scale-[0.98]">
                      {/* Image Placeholder if no images */}
                      <div className="relative aspect-video bg-slate-200 dark:bg-slate-700">
                         {gig.images && gig.images[0] ? (
                           <img
                             alt={gig.title}
                             className="w-full h-full object-cover"
                             src={gig.images[0]}
                           />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center text-slate-400">
                             <span className="material-symbols-outlined text-4xl">image</span>
                           </div>
                         )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {gig.profiles?.avatar_url ? (
                              <img
                                alt={gig.profiles.full_name || "User"}
                                className="h-6 w-6 rounded-full object-cover border border-primary/20"
                                src={gig.profiles.avatar_url}
                              />
                            ) : (
                              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                {gig.profiles?.full_name?.charAt(0) || "U"}
                              </div>
                            )}
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{gig.profiles?.full_name || "Unknown User"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-amber-400 text-sm">star</span>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">5.0</span>
                          </div>
                        </div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-white leading-tight mb-3">
                          {gig.title}
                        </h3>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-700/50">
                          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest leading-none">Starting at</span>
                          <span className="text-lg font-bold text-primary leading-none">RM {gig.price}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </main>

        <BottomNav />
      </div>
    </div>
  );
};

export default Gigs;
