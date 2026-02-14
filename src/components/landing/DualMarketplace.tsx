import { UserCheck, SearchCheck, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const studentFeatures = [
  "Create custom gig packages",
  "Set your own flexible rates",
  "Build a verified portfolio",
];

const clientFeatures = [
  "Browse local talent map",
  "Review verified .edu.my users",
  "Pay securely upon completion",
];

export function DualMarketplace() {
  return (
    <section id="how-it-works" className="px-4 py-20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm border-y border-border">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">The Dual-Way Marketplace</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A bilateral exchange where students push services and clients pull talent — creating a thriving ecosystem.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Student-Push */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative group bg-secondary/50 p-8 rounded-3xl border border-border transition-all hover:shadow-2xl hover:shadow-primary/5"
          >
            <div className="bg-primary/10 text-primary w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <UserCheck className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Student-Push</h3>
            <p className="text-muted-foreground mb-6">
              Post your Gigs & Portfolio. Build your professional legacy and grow your skills from Newbie to Expert status while studying.
            </p>
            <ul className="space-y-3">
              {studentFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Client-Pull */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative group gradient-primary p-8 rounded-3xl transition-all hover:shadow-2xl hover:shadow-primary/20"
          >
            <div className="bg-white/20 text-primary-foreground w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <SearchCheck className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-primary-foreground">Client-Pull</h3>
            <p className="text-primary-foreground/80 mb-6">
              Post Jobs & Find Talent. Access verified student skills nearby. From complex coding tasks to simple household repairs.
            </p>
            <ul className="space-y-3">
              {clientFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm font-medium text-primary-foreground">
                  <CheckCircle className="h-4 w-4 text-primary-foreground/50 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
