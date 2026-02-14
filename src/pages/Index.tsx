import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { DualMarketplace } from "@/components/landing/DualMarketplace";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { Footer } from "@/components/landing/Footer";
import { BottomNav } from "@/components/BottomNav";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar />
      <main>
        <HeroSection />
        <DualMarketplace />
        <FeaturesSection />
        <StatsSection />
      </main>
      <Footer />
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

export default Index;
