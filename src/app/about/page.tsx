// about/page.tsx
import HeroSection from '@/components/about/HeroSection';
import PricingSection from '@/components/about/PricingSection';
import AboutSection from '@/components/about/AboutSection';
import ContactSection from '@/components/about/ContactSection';
import Navbar from '@/components/about/Navbar';
import TestimonialSection from '@/components/about/Testimonial';
import Testimonial from '@/components/about/Testimonial';
import PartnersSection from '@/components/about/PartnersSection';
import BlogsSection from '@/components/about/BlogSection';
import FaqsSection from '@/components/about/FaqsSection';
import Footer from '@/components/about/Footer';
import HowItWorksSection from '@/components/about/HowSection';

export default function AboutPage() {
  return (
    <>
    <Navbar />
    <main className="min-h-screen">
      <HeroSection />
    
      <AboutSection />
      <PricingSection />
      <Testimonial />
      <PartnersSection />
      <BlogsSection />
      <HowItWorksSection />
      <FaqsSection />
      <ContactSection />
      <Footer />
    </main>
    </>
  );
}