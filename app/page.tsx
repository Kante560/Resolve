import Navbar from "@/components/ui/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import StatsSection from "@/components/sections/StatsSection";
import WhyBaseSection from "@/components/sections/WhyBaseSection";
import ContractSection from "@/components/sections/ContractSection";
import CtaSection from "@/components/sections/CtaSection";
import Footer from "@/components/ui/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <StatsSection />
        <WhyBaseSection />
        <ContractSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
