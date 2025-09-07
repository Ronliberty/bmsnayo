// about/page.tsx
import HeroSection from '@/components/about/HeroSection';
import PricingSection from '@/components/about/PricingSection';
import AboutSection from '@/components/about/AboutSection';
import ContactSection from '@/components/about/ContactSection';

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <PricingSection />
      <ContactSection />
    </main>
  );
}