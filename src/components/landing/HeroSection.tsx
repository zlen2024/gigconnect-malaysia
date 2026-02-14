import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-image.png";

export function HeroSection() {
  return (
    <header className="relative overflow-hidden pt-16 pb-24 px-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="secondary" className="mb-6 gap-1.5 px-3 py-1.5 text-xs font-bold text-primary border-primary/20">
            <ShieldCheck className="h-3.5 w-3.5" />
            MALAYSIA'S #1 STUDENT MARKETPLACE
          </Badge>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight mb-6">
            Empowering the{" "}
            <span className="gradient-text">Malaysian Student-Gig</span>{" "}
            Community
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-lg">
            Where Students Push Services & Clients Pull Talent. The bilateral marketplace for the next generation of professionals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="text-base font-bold shadow-primary-glow group" asChild>
              <Link to="/signup?role=student">
                Join as Student
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base font-bold border-primary/20 text-primary hover:bg-primary/5" asChild>
              <Link to="/signup?role=client">Hire Talent</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="hidden lg:block"
        >
          <div className="relative">
            <div className="absolute -inset-4 gradient-primary rounded-3xl opacity-10 blur-2xl" />
            <img
              src={heroImage}
              alt="SiswaGig platform connecting Malaysian students with gig opportunities"
              className="relative rounded-2xl shadow-2xl w-full object-cover"
            />
          </div>
        </motion.div>
      </div>

      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.07] pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary-glow rounded-full blur-3xl" />
      </div>
    </header>
  );
}
