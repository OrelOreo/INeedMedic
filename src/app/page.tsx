import { HeroSection } from "@/components/home/hero-section";
import FeatureSection from "@/components/home/feature-section";
import HowItWorks from "@/components/home/how-it-works-section";
import CtaSection from "@/components/home/cta-section";
import Footer from "@/components/shared/footer";

export default async function HomePage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <HeroSection />

      <FeatureSection />

      <HowItWorks />

      <CtaSection />
      <Footer />
    </main>
  );
}
