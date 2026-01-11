import { HeroSection } from "@/components/home/hero-section";
import FeatureSection from "@/components/home/feature-section";
import HowItWorks from "@/components/home/how-it-works-section";
import CtaSection from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <HeroSection />

      <FeatureSection />

      <HowItWorks />

      <CtaSection />
    </div>
  );
}
