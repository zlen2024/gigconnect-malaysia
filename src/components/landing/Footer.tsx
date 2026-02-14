import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Rocket, Globe, AtSign, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background pt-20 pb-32 md:pb-20 px-4 border-t border-border">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="max-w-md">
          <div className="flex items-center gap-2 mb-6">
            <div className="gradient-primary p-1.5 rounded-lg">
              <Rocket className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-primary">SiswaGig</span>
          </div>
          <p className="text-muted-foreground mb-6">
            Building the economic backbone for Malaysia's future talent pool. Start earning while you learn.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Globe className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <AtSign className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <ExternalLink className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-auto">
          <h5 className="text-lg font-bold">Ready to get started?</h5>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="font-bold" asChild>
              <Link to="/signup?role=student">Join as Student</Link>
            </Button>
            <Button variant="outline" className="font-bold border-primary/20 text-primary" asChild>
              <Link to="/signup?role=client">Hire Talent</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-border text-center text-muted-foreground text-sm">
        © {new Date().getFullYear()} SiswaGig Malaysia. All rights reserved. Built for students, by students.
      </div>
    </footer>
  );
}
