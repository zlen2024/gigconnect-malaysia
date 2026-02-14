import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { DualMarketplace } from "@/components/landing/DualMarketplace";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { Footer } from "@/components/landing/Footer";
import { MobileBottomNav } from "@/components/landing/MobileBottomNav";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <DualMarketplace />
        <FeaturesSection />
        <StatsSection />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default Index;
