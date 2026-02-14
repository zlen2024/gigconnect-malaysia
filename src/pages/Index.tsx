import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { DualMarketplace } from "@/components/landing/DualMarketplace";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white/40 dark:bg-slate-900/90 backdrop-blur-sm pb-20 md:pb-0">
      <Navbar />
      <main>
        <HeroSection />
        <DualMarketplace />
        <FeaturesSection />
        <StatsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
